import { UserManager } from 'oidc-client'
import { logoutUser } from '../../../packages/sn-authentication-oidc-react/src/oidc-service'

describe('IdentityServer logout navigation', () => {
  const originalLocation = window.location
  const reload = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    delete (window as any).location
    window.location = { ...originalLocation, reload } as Location
  })

  afterEach(() => {
    window.location = originalLocation
  })

  it('lets the IdentityServer redirect finish without reloading the current page', async () => {
    // oidc-client resolves as soon as it starts navigation, before the logout response arrives.
    const signoutRedirect = jest.fn().mockResolvedValue(undefined)
    const manager = {
      getUser: jest.fn().mockResolvedValue({}),
      signoutRedirect,
    } as unknown as UserManager

    await logoutUser(manager)

    expect(signoutRedirect).toHaveBeenCalledTimes(1)
    expect(reload).not.toHaveBeenCalled()
  })

  it('preserves redirect errors for the authentication provider to handle', async () => {
    const error = new Error('IdentityServer is unavailable')
    const manager = {
      getUser: jest.fn().mockResolvedValue({}),
      signoutRedirect: jest.fn().mockRejectedValue(error),
    } as unknown as UserManager

    await expect(logoutUser(manager)).rejects.toBe(error)
    expect(reload).not.toHaveBeenCalled()
  })

  it('does not start another logout when there is no stored OIDC user', async () => {
    const signoutRedirect = jest.fn()
    const manager = {
      getUser: jest.fn().mockResolvedValue(null),
      signoutRedirect,
    } as unknown as UserManager

    await logoutUser(manager)

    expect(signoutRedirect).not.toHaveBeenCalled()
    expect(reload).not.toHaveBeenCalled()
  })
})
