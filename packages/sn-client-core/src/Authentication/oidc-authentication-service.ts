import { User, UserManager, UserManagerSettings } from 'oidc-client'
import { ObservableValue } from '@sensenet/client-utils'

// Re export UserManagerSettings
export { UserManagerSettings }

export const authenticationResultStatus = {
  redirect: 'redirect',
  success: 'success',
  fail: 'fail',
} as const

export class OIDCAuthenticationService {
  public user: ObservableValue<User | undefined> = new ObservableValue(undefined)
  private userManager?: UserManager

  constructor(private readonly settings: UserManagerSettings & { isPopupEnabled?: boolean }) {}

  async isAuthenticated(authorityUrl?: string) {
    const user = await this.getUser(authorityUrl)
    return !!user
  }

  async getUser(authorityUrl?: string) {
    if (this.user.getValue()?.profile) {
      return this.user.getValue()?.profile
    }

    if (!authorityUrl) {
      return
    }

    await this.ensureUserManagerInitialized(authorityUrl)
    const user = await this.userManager?.getUser()
    return user?.profile
  }

  async getAccessToken(authorityUrl: string) {
    await this.ensureUserManagerInitialized(authorityUrl)
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
  async signIn(state: { returnUrl: string }, authorityUrl: string) {
    await this.ensureUserManagerInitialized(authorityUrl)
    try {
      const silentUser = await this.userManager?.signinSilent(this.createArguments())
      this.updateState(silentUser)
      return this.success(state)
    } catch (silentError) {
      // User might not be authenticated, fallback to popup authentication
      console.log('Silent authentication error: ', silentError)

      if (this.settings.isPopupEnabled) {
        try {
          const popUpUser = await this.userManager?.signinPopup(this.createArguments())
          this.updateState(popUpUser)
          return this.success(state)
        } catch (popUpError) {
          if (popUpError.message === 'Popup window closed') {
            // The user explicitly cancelled the login action by closing an opened popup.
            return this.error('The user closed the window.')
          }
          console.log('Popup authentication error: ', popUpError)
        }
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

  async completeSignIn(authorityUrl: string, url?: string) {
    try {
      await this.ensureUserManagerInitialized(authorityUrl)
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
  async signOut(state: { returnUrl: string }, authorityUrl: string) {
    await this.ensureUserManagerInitialized(authorityUrl)

    if (this.settings.isPopupEnabled) {
      try {
        await this.userManager?.signoutPopup(this.createArguments())
        this.updateState(undefined)
        return this.success(state)
      } catch (popupSignOutError) {
        console.log('Popup signout error: ', popupSignOutError)
        return this.error(popupSignOutError.message)
      }
    }

    try {
      await this.userManager?.signoutRedirect(this.createArguments(state))
      return this.redirect()
    } catch (redirectSignOutError) {
      console.log('Redirect signout error: ', redirectSignOutError)
      return this.error(redirectSignOutError)
    }
  }

  async completeSignOut(url: string, authorityUrl: string) {
    await this.ensureUserManagerInitialized(authorityUrl)
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
    this.user?.setValue(user)
  }

  createArguments(state?: { returnUrl: string }) {
    return { useReplaceToNavigate: true, data: state }
  }

  error(message: string) {
    return { status: authenticationResultStatus.fail, message }
  }

  success(state: { returnUrl: string }) {
    return { status: authenticationResultStatus.success, state }
  }

  redirect() {
    return { status: authenticationResultStatus.redirect }
  }

  async ensureUserManagerInitialized(authorityUrl: string) {
    if (this.userManager !== undefined && authorityUrl === this.userManager.settings.authority) {
      return
    }

    this.userManager = new UserManager({ ...this.settings, authority: authorityUrl })

    this.userManager.events.addUserSignedOut(async () => {
      await this.userManager?.removeUser()
      this.updateState(undefined)
    })
  }
}
