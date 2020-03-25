import { UserManager, UserManagerSettings, WebStorageStateStore } from 'oidc-client'

let userManager: UserManager | undefined

export const setUserManager = (userManagerToSet: UserManager) => {
  userManager = userManagerToSet
}

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

export { WebStorageStateStore, UserManagerSettings, UserManager }
