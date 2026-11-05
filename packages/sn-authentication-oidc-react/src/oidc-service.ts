import { History, Location } from 'history'
import { User, UserManager } from 'oidc-client'
import { removeUserManager } from './authentication-service'
import { isSupersededOidcOperation, runOidcLogout } from './user-manager-lifecycle'

let userRequested = false
let numberAuthentication = 0

const isRequireSignin = (oidcUser: User | null, isForce: boolean) => isForce || !oidcUser

export const authenticateUser =
  (userManager: UserManager, location: Location, history: History, user: User | null = null) =>
  async (isForce = false, callbackPath: string | null = null) => {
    const oidcUser = user !== null ? user : await userManager.getUser()

    if (userRequested) {
      return
    }
    numberAuthentication++
    const url = callbackPath || location.pathname + (location.search || '')

    if (isRequireSignin(oidcUser, isForce)) {
      userRequested = true
      try {
        await userManager.signinRedirect({ data: { url } })
      } catch (error) {
        if (!isSupersededOidcOperation(error)) removeUserManager()
        throw error
      } finally {
        userRequested = false
      }
    } else if (oidcUser?.expired) {
      userRequested = true
      try {
        await userManager.signinSilent()
      } catch (error) {
        if (isSupersededOidcOperation(error)) throw error
        if (numberAuthentication <= 1) {
          await userManager.signinRedirect({ data: { url } })
        } else {
          userRequested = false
          history.push(`/authentication/session-lost?path=${encodeURI(url)}`)
        }
      } finally {
        userRequested = false
      }
    }
  }

export const logoutUser = async (userManager: UserManager) =>
  runOidcLogout(userManager, async (ensureCurrent) => {
    const oidcUser = await userManager.getUser()
    ensureCurrent()
    if (oidcUser) await userManager.signoutRedirect()
  })
