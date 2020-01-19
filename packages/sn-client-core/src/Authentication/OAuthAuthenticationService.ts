import { User, UserManager, WebStorageStateStore } from 'oidc-client'

export const ApplicationName = 'SenseNet.Tests.SPA'

export const QueryParameterNames = {
  ReturnUrl: 'returnUrl',
  Message: 'message',
}

export const LogoutActions = {
  LogoutCallback: 'logout-callback',
  Logout: 'logout',
  LoggedOut: 'logged-out',
}

export const LoginActions = {
  Login: 'login',
  LoginCallback: 'login-callback',
  LoginFailed: 'login-failed',
  Profile: 'profile',
  Register: 'register',
}

const prefix = '/authentication'

export const ApplicationPaths = {
  DefaultLoginRedirectPath: '/',
  ApiAuthorizationClientConfigurationUrl: `/_configuration/${ApplicationName}`,
  ApiAuthorizationPrefix: prefix,
  Login: `${prefix}/${LoginActions.Login}`,
  LoginFailed: `${prefix}/${LoginActions.LoginFailed}`,
  LoginCallback: `${prefix}/${LoginActions.LoginCallback}`,
  Register: `${prefix}/${LoginActions.Register}`,
  Profile: `${prefix}/${LoginActions.Profile}`,
  LogOut: `${prefix}/${LogoutActions.Logout}`,
  LoggedOut: `${prefix}/${LogoutActions.LoggedOut}`,
  LogOutCallback: `${prefix}/${LogoutActions.LogoutCallback}`,
  IdentityRegisterPath: '/Identity/Account/Register',
  IdentityManagePath: '/Identity/Account/Manage',
}

export const AuthenticationResultStatus = {
  Redirect: 'redirect',
  Success: 'success',
  Fail: 'fail',
}

export class OAuthAuthenticationService {
  private callbacks: Array<{ callback: () => void; subscription: number }> = []
  private nextSubscriptionId = 0
  private user?: User
  private userManager?: UserManager

  async isAuthenticated() {
    const user = await this.getUser()
    return !!user
  }

  async getUser() {
    if (this.user?.profile) {
      return this.user.profile
    }

    await this.ensureUserManagerInitialized()
    const user = await this.userManager?.getUser()
    return user?.profile
  }

  async getAccessToken() {
    await this.ensureUserManagerInitialized()
    const user = await this.userManager?.getUser()
    return user?.access_token
  }

  // We try to authenticate the user in three different ways:
  // 1) We try to see if we can authenticate the user silently. This happens
  //    when the user is already logged in on the IdP and is done using a hidden iframe
  //    on the client.
  // 2) We try to authenticate the user using a PopUp Window. This might fail if there is a
  //    Pop-Up blocker or the user has disabled PopUps.
  // 3) If the two methods above fail, we redirect the browser to the IdP to perform a traditional
  //    redirect flow.
  async signIn(state: { returnUrl: string }) {
    await this.ensureUserManagerInitialized()
    try {
      const silentUser = await this.userManager?.signinSilent(this.createArguments())
      this.updateState(silentUser)
      return this.success(state)
    } catch (silentError) {
      // User might not be authenticated, fallback to popup authentication
      console.log('Silent authentication error: ', silentError)

      try {
        const popUpUser = await this.userManager?.signinPopup(this.createArguments())
        this.updateState(popUpUser)
        return this.success(state)
      } catch (popUpError) {
        if (popUpError.message === 'Popup window closed') {
          // The user explicitly cancelled the login action by closing an opened popup.
          return this.error('The user closed the window.')
        }

        // PopUps might be blocked by the user, fallback to redirect
        try {
          await this.userManager?.signinRedirect(this.createArguments(state))
          return this.redirect()
        } catch (redirectError) {
          console.log('Redirect authentication error: ', redirectError)
          return this.error(redirectError)
        }
      }
    }
  }

  async completeSignIn(url: string) {
    try {
      await this.ensureUserManagerInitialized()
      const user = await this.userManager?.signinCallback(url)
      this.updateState(user)
      return this.success(user?.state)
    } catch (error) {
      console.log('There was an error signing in: ', error)
      return this.error('There was an error signing in.')
    }
  }

  // We try to sign out the user in two different ways:
  // 1) We try to do a sign-out using a PopUp Window. This might fail if there is a
  //    Pop-Up blocker or the user has disabled PopUps.
  // 2) If the method above fails, we redirect the browser to the IdP to perform a traditional
  //    post logout redirect flow.
  async signOut(state: { returnUrl: string }) {
    await this.ensureUserManagerInitialized()
    try {
      await this.userManager?.signoutPopup(this.createArguments())
      this.updateState(undefined)
      return this.success(state)
    } catch (popupSignOutError) {
      console.log('Popup signout error: ', popupSignOutError)
      try {
        await this.userManager?.signoutRedirect(this.createArguments(state))
        return this.redirect()
      } catch (redirectSignOutError) {
        console.log('Redirect signout error: ', redirectSignOutError)
        return this.error(redirectSignOutError)
      }
    }
  }

  async completeSignOut(url: string) {
    await this.ensureUserManagerInitialized()
    try {
      const response = await this.userManager?.signoutCallback(url)
      this.updateState(undefined)
      return this.success(response && response.state)
    } catch (error) {
      console.log(`There was an error trying to log out '${error}'.`)
      return this.error(error)
    }
  }

  updateState(user?: User) {
    this.user = user
    this.notifySubscribers()
  }

  subscribe(callback: () => void) {
    this.callbacks.push({ callback, subscription: this.nextSubscriptionId++ })
    return this.nextSubscriptionId - 1
  }

  unsubscribe(subscriptionId: number) {
    const subscriptionIndex = this.callbacks.findIndex(element => element.subscription === subscriptionId)
    if (subscriptionIndex === -1) {
      throw new Error(`Found an invalid number of subscriptions ${subscriptionIndex}.`)
    }

    this.callbacks = this.callbacks.splice(subscriptionIndex, 1)
  }

  notifySubscribers() {
    for (let i = 0; i < this.callbacks.length; i++) {
      const { callback } = this.callbacks[i]
      callback()
    }
  }

  createArguments(state?: { returnUrl: string }) {
    return { useReplaceToNavigate: true, data: state }
  }

  error(message: string) {
    return { status: AuthenticationResultStatus.Fail, message }
  }

  success(state: { returnUrl: string }) {
    return { status: AuthenticationResultStatus.Success, state }
  }

  redirect() {
    return { status: AuthenticationResultStatus.Redirect }
  }

  async ensureUserManagerInitialized() {
    if (this.userManager !== undefined) {
      return
    }

    const response = await fetch(ApplicationPaths.ApiAuthorizationClientConfigurationUrl)
    if (!response.ok) {
      throw new Error(`Could not load settings for '${ApplicationName}'`)
    }

    const settings = await response.json()
    settings.automaticSilentRenew = true
    settings.includeIdTokenInSilentRenew = true
    settings.userStore = new WebStorageStateStore({
      prefix: ApplicationName,
    })

    this.userManager = new UserManager(settings)

    this.userManager.events.addUserSignedOut(async () => {
      await this.userManager?.removeUser()
      this.updateState(undefined)
    })
  }
}
