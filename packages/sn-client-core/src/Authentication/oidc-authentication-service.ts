import { User, UserManager, UserManagerSettings } from 'oidc-client'
import { ObservableValue } from '@sensenet/client-utils'

// Re export UserManager
export { UserManager, User as OidcUser, UserManagerSettings }

export const authenticationResultStatus = {
  redirect: 'redirect',
  success: 'success',
  fail: 'fail',
} as const

export interface AuthFuncOptions {
  returnUrl: string
}

export type AuthFuncResult = Promise<
  | { status: 'redirect' }
  | {
      status: 'success'
      state: {
        returnUrl: string
      }
    }
  | {
      status: 'fail'
      error: Error
    }
>

interface AuthOptions {
  userManager: UserManager
  isPopupEnabled?: boolean
}

export class OIDCAuthenticationService {
  public user: ObservableValue<User | undefined> = new ObservableValue(undefined)
  public userManager: UserManager
  private isPopupEnabled = true

  constructor({ isPopupEnabled = true, userManager }: AuthOptions) {
    this.isPopupEnabled = isPopupEnabled
    this.userManager = userManager
  }

  async isAuthenticated() {
    const user = await this.getUser()
    return !!user
  }

  async getUser() {
    if (this.user.getValue()?.profile) {
      return this.user.getValue()?.profile
    }

    const user = await this.userManager.getUser()
    return user?.profile
  }

  async getAccessToken() {
    const user = await this.userManager.getUser()
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
  async signIn({ returnUrl }: AuthFuncOptions): AuthFuncResult {
    try {
      const silentUser = await this.userManager.signinSilent(this.createArguments())
      this.updateState(silentUser)
      return this.success({ returnUrl })
    } catch (silentError) {
      // User might not be authenticated, fallback to popup authentication
      console.log('Silent authentication error: ', silentError)

      if (this.isPopupEnabled) {
        try {
          const popUpUser = await this.userManager.signinPopup(this.createArguments())
          this.updateState(popUpUser)
          return this.success({ returnUrl })
        } catch (popUpError) {
          if (popUpError.message === 'Popup window closed') {
            // The user explicitly cancelled the login action by closing an opened popup.
            return this.error(new Error('The user closed the window.'))
          }
          console.log('Popup authentication error: ', popUpError)
        }
      }

      // PopUps might be blocked by the user, fallback to redirect
      try {
        await this.userManager.signinRedirect(this.createArguments({ returnUrl }))
        return this.redirect()
      } catch (redirectError) {
        console.log('Redirect authentication error: ', redirectError)
        return this.error(redirectError)
      }
    }
  }

  async completeSignIn(url?: string) {
    try {
      const user = await this.userManager.signinCallback(url)
      this.updateState(user)
      return this.success(user?.state)
    } catch (error) {
      console.log('There was an error signing in: ', error)
      return this.error(new Error('There was an error signing in.'))
    }
  }

  // We try to sign out the user in two different ways:
  // 1) We try to do a sign-out using a PopUp Window. This might fail if there is a
  //    Pop-Up blocker or the user has disabled PopUps.
  // 2) If the method above fails, we redirect the browser to the IdP to perform a traditional
  //    post logout redirect flow.
  async signOut({ returnUrl }: AuthFuncOptions): AuthFuncResult {
    if (this.isPopupEnabled) {
      try {
        await this.userManager.signoutPopup(this.createArguments())
        this.updateState(undefined)
        return this.success({ returnUrl })
      } catch (popupSignOutError) {
        console.log('Popup signout error: ', popupSignOutError)
      }
    }

    try {
      await this.userManager.signoutRedirect(this.createArguments({ returnUrl }))
      return this.redirect()
    } catch (redirectSignOutError) {
      console.log('Redirect signout error: ', redirectSignOutError)
      return this.error(redirectSignOutError)
    }
  }

  async completeSignOut(url?: string) {
    try {
      const response = await this.userManager.signoutCallback(url)
      this.updateState(undefined)
      return this.success(response && response.state)
    } catch (error) {
      console.log(`There was an error trying to log out '${error}'.`)
      return this.error(error)
    }
  }

  updateState(user?: User) {
    this.user.setValue(user)
  }

  createArguments(state?: { returnUrl: string }) {
    return { useReplaceToNavigate: true, data: state }
  }

  error(error: Error) {
    return { status: authenticationResultStatus.fail, error }
  }

  success(state: { returnUrl: string }) {
    return { status: authenticationResultStatus.success, state }
  }

  redirect() {
    return { status: authenticationResultStatus.redirect }
  }
}
