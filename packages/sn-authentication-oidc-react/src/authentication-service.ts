import { UserManager, UserManagerSettings } from 'oidc-client'

let userManager: UserManager | undefined

export const getUserManager = () => {
  return userManager
}

export const authenticationService = (configuration: UserManagerSettings) => {
  if (userManager) {
    return userManager
  }
  userManager = new UserManager(configuration)
  return userManager
}
