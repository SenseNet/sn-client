import { UserManager, UserManagerSettings } from 'oidc-client'
import { coordinateUserManager } from './user-manager-lifecycle'

let userManager: UserManager | undefined

export const getUserManager = () => {
  return userManager
}

export const removeUserManager = () => {
  userManager = undefined
}

export const authenticationService = (configuration: UserManagerSettings) => {
  if (userManager) {
    return userManager
  }
  userManager = coordinateUserManager(new UserManager(configuration), configuration)
  return userManager
}
