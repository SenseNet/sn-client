import { UserManager, UserManagerSettings } from 'oidc-client'

let userManager: UserManager | undefined

export const getUserManager = () => {
  return userManager
}

export const authenticationService = (configuration: UserManagerSettings, forceNew = false) => {
  if (userManager && !forceNew) {
    return userManager
  }
  userManager = new UserManager(configuration)
  return userManager
}
