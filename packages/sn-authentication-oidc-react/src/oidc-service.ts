import { History, Location } from 'history'
import { User, UserManager } from 'oidc-client'

let userRequested = false
let numberAuthentication = 0

const isRequireSignin = (oidcUser: User | null, isForce: boolean) => isForce || !oidcUser

export const authenticateUser = (
  userManager: UserManager,
  location: Location,
  history: History,
  user: User | null = null,
) => async (isForce = false, callbackPath: string | null = null) => {
  let oidcUser = user
  if (!oidcUser) {
    oidcUser = await userManager.getUser()
  }
  if (userRequested) {
    return
  }
  numberAuthentication++
  const url = callbackPath || location.pathname + (location.search || '')

  if (isRequireSignin(oidcUser, isForce)) {
    userRequested = true
    await userManager.signinRedirect({ data: { url } })
    userRequested = false
  } else if (oidcUser?.expired) {
    userRequested = true
    try {
      await userManager.signinSilent()
    } catch (error) {
      if (numberAuthentication <= 1) {
        await userManager.signinRedirect({ data: { url } })
      } else {
        userRequested = false
        history.push(`/authentication/session-lost?path=${encodeURI(url)}`)
      }
    }
    userRequested = false
  }
}

export const logoutUser = async (userManager?: UserManager) => {
  if (!userManager) {
    return
  }
  const oidcUser = await userManager.getUser()
  if (oidcUser) {
    await userManager.signoutRedirect()
  }
}
