import { User, UserManager } from 'oidc-client'
import { addOidcEvents, removeOidcEvents } from '../../../packages/sn-authentication-oidc-react/src/oidc-events'

const createManager = () =>
  new UserManager({
    authority: 'https://identity.example.invalid',
    client_id: 'event-lifecycle-test',
    redirect_uri: 'http://localhost/callback',
    automaticSilentRenew: false,
    monitorSession: false,
  })

describe('OIDC event subscription lifecycle', () => {
  let manager: UserManager

  beforeEach(() => {
    manager = createManager()
    jest.spyOn(manager, 'signinSilent').mockResolvedValue({} as User)
  })

  afterEach(() => {
    manager.events.unload()
    manager.stopSilentRenew()
  })

  it('does not renew twice or dispatch to the old provider after resubscribing', async () => {
    const previousDispatch = jest.fn()
    const currentDispatch = jest.fn()
    const previousOptions = { userManager: manager, dispatch: previousDispatch }
    addOidcEvents(previousOptions)
    removeOidcEvents(previousOptions)
    const dispose = addOidcEvents({ userManager: manager, dispatch: currentDispatch })

    ;(manager.events as any)._accessTokenExpired.raise()
    await Promise.resolve()

    expect(manager.signinSilent).toHaveBeenCalledTimes(1)
    expect(previousDispatch).not.toHaveBeenCalled()
    expect(currentDispatch).toHaveBeenCalledTimes(1)
    dispose()
  })

  it('removes every subscribed callback and makes cleanup idempotent', () => {
    const dispatch = jest.fn()
    const customEvents = {
      onUserLoaded: jest.fn(),
      onUserUnloaded: jest.fn(),
      onSilentRenewError: jest.fn(),
      onUserSignedOut: jest.fn(),
      onAccessTokenExpired: jest.fn(),
      onAccessTokenExpiring: jest.fn(),
      onUserSessionChanged: jest.fn(),
    }
    const dispose = addOidcEvents({ userManager: manager, dispatch, customEvents })
    dispose()
    dispose()

    const events = manager.events as any
    events._userLoaded.raise({})
    events.unload()
    events._raiseSilentRenewError(new Error('Disconnected'))
    events._raiseUserSignedOut()
    events._accessTokenExpired.raise()
    events._accessTokenExpiring.raise()
    events._raiseUserSessionChanged()

    expect(dispatch).not.toHaveBeenCalled()
    expect(manager.signinSilent).not.toHaveBeenCalled()
    Object.values(customEvents).forEach((callback) => expect(callback).not.toHaveBeenCalled())
  })

  it('keeps another subscriber active when one provider is removed', () => {
    const previousDispatch = jest.fn()
    const currentDispatch = jest.fn()
    const first = { userManager: manager, dispatch: previousDispatch }
    addOidcEvents(first)
    const disposeCurrent = addOidcEvents({ userManager: manager, dispatch: currentDispatch })

    removeOidcEvents(first)
    ;(manager.events as any)._raiseUserSignedOut()

    expect(previousDispatch).not.toHaveBeenCalled()
    expect(currentDispatch).toHaveBeenCalledWith({ type: 'ON_UNLOAD_USER' })
    disposeCurrent()
  })

  it('reports failed renewal instead of leaving an unhandled rejection', async () => {
    const dispatch = jest.fn()
    ;(manager.signinSilent as jest.Mock).mockRejectedValueOnce(new Error('Renewal unavailable'))
    const dispose = addOidcEvents({ userManager: manager, dispatch })

    ;(manager.events as any)._accessTokenExpired.raise()
    await Promise.resolve()
    await Promise.resolve()
    await Promise.resolve()

    expect(dispatch).toHaveBeenLastCalledWith({
      type: 'ON_ERROR',
      message: 'Renewal unavailable',
      operation: 'refresh',
    })
    dispose()
  })
})
