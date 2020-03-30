import { authenticationService, getUserManager } from '../src/authentication-service'
import { UserManager } from '../src'

describe('Authentication service', () => {
  let manager: any

  beforeEach(() => {
    manager = authenticationService({})
  })

  it('should create new usermanager for the first time', () => {
    expect(manager).toBeInstanceOf(UserManager)
  })

  it('should not create new usermanager for the second time', () => {
    const sameManager = authenticationService({})
    expect(sameManager).toEqual(manager)
  })

  it('should give back the same instace for getUserManager', () => {
    const managerFromGetUserManager = getUserManager()
    expect(manager).toEqual(managerFromGetUserManager)
  })
})
