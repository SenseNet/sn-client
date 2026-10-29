import { User, UserManager, UserManagerSettings } from 'oidc-client'
import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import { AuthenticationProvider, useOidcAuthentication } from '../../../packages/sn-authentication-oidc-react/src'
import {
  authenticationService,
  removeUserManager,
} from '../../../packages/sn-authentication-oidc-react/src/authentication-service'
import { CallbackContainer } from '../../../packages/sn-authentication-oidc-react/src/components/callback'
import { addOidcEvents } from '../../../packages/sn-authentication-oidc-react/src/oidc-events'

const deferred = <T,>() => {
  let resolve!: (value: T) => void
  let reject!: (error: Error) => void
  const promise = new Promise<T>((finish, fail) => {
    resolve = finish
    reject = fail
  })
  return { promise, resolve, reject }
}
const user = (accessToken: string) =>
  new User({
    profile: { sub: '42' },
    access_token: accessToken,
    id_token: 'synthetic-id-token',
    token_type: 'Bearer',
    scope: 'openid',
    expires_at: Math.floor(Date.now() / 1000) + 3600,
  })

describe('OIDC in-flight operation lifecycle', () => {
  let manager: UserManager
  let settings: UserManagerSettings
  let navigation: ReturnType<typeof deferred<{ url: string }>>
  let iframeStarted: ReturnType<typeof deferred<void>>
  let element: HTMLDivElement
  let auth: ReturnType<typeof useOidcAuthentication>
  const staleUser = user('old-silent-access')
  const freshUser = user('fresh-explicit-access')
  const Probe = () => {
    auth = useOidcAuthentication()
    return <div>{auth.error || auth.oidcUser?.access_token || 'Signed out'}</div>
  }

  beforeEach(async () => {
    sessionStorage.clear()
    window.history.replaceState(null, '', '/')
    removeUserManager()
    navigation = deferred<{ url: string }>()
    iframeStarted = deferred<void>()
    settings = {
      authority: 'https://identity.example.invalid',
      client_id: 'operation-lifecycle-test',
      redirect_uri: 'http://localhost/callback',
      response_type: 'code',
      automaticSilentRenew: false,
      monitorSession: false,
      metadata: {
        authorization_endpoint: 'https://identity.example.invalid/connect/authorize',
      },
      iframeNavigator: {
        prepare: () =>
          Promise.resolve({
            navigate: () => {
              iframeStarted.resolve()
              return navigation.promise
            },
            close: jest.fn(),
          }),
      },
      redirectNavigator: {
        prepare: () => Promise.resolve({ navigate: jest.fn().mockResolvedValue({ url: '' }), close: jest.fn() }),
      },
    } as UserManagerSettings
    manager = authenticationService(settings)
    await manager.storeUser(user('initial-access'))
    // Keep the real iframe completion, user store and UserLoaded events. Only the
    // identity provider's signed response validation is replaced with synthetic users.
    jest
      .spyOn(UserManager.prototype, 'processSigninResponse')
      .mockImplementation(async (url) => (url.includes('fresh-explicit') ? freshUser : staleUser))
    element = document.createElement('div')
    document.body.appendChild(element)
  })

  afterEach(() => {
    act(() => {
      unmountComponentAtNode(element)
    })
    manager.events.unload()
    manager.stopSilentRenew()
    removeUserManager()
    element.remove()
    sessionStorage.clear()
    jest.restoreAllMocks()
  })

  const mount = () =>
    act(async () => {
      render(
        <AuthenticationProvider configuration={settings} history={{ location: window.location } as any}>
          <Probe />
        </AuthenticationProvider>,
        element,
      )
    })
  const beginRenewal = () =>
    act(async () => {
      ;(manager.events as any)._accessTokenExpired.raise()
      await iframeStarted.promise
    })

  it('cannot restore the stored user when an old iframe completes after a failed logout', async () => {
    jest
      .spyOn(manager.metadataService, 'getEndSessionEndpoint')
      .mockRejectedValueOnce(new Error('End-session is unavailable'))
    await mount()
    await beginRenewal()
    await act(async () => {
      await auth.logout()
    })
    expect(auth.errorOperation).toBe('logout')
    expect(await manager.getUser()).toBeNull()

    await act(async () => {
      navigation.resolve({ url: 'http://localhost/callback?code=old-silent' })
    })
    expect(await manager.getUser()).toBeNull()
    expect(auth.oidcUser).toBeUndefined()
    expect(auth.errorOperation).toBe('logout')
    expect(element.textContent).toBe('End-session is unavailable')
  })

  it('ignores an older iframe failure after a fresh user callback was completed', async () => {
    await mount()
    await beginRenewal()
    await act(async () => {
      await manager.signinRedirectCallback('http://localhost/callback?code=fresh-explicit')
    })
    expect(auth.oidcUser?.access_token).toBe(freshUser.access_token)

    await act(async () => {
      navigation.reject(new Error('The older silent request failed'))
    })
    expect(auth.error).toBeUndefined()
    expect(auth.oidcUser?.access_token).toBe(freshUser.access_token)
    expect((await manager.getUser())?.access_token).toBe(freshUser.access_token)
  })

  it('does not dispatch a late iframe failure to a disposed event subscription', async () => {
    const dispatch = jest.fn()
    const dispose = addOidcEvents({ userManager: manager, dispatch })
    ;(manager.events as any)._accessTokenExpired.raise()
    await iframeStarted.promise
    dispose()
    dispatch.mockClear()

    navigation.reject(new Error('The disposed silent request failed'))
    await new Promise((resolve) => setTimeout(resolve, 0))
    expect(dispatch).not.toHaveBeenCalled()
  })

  it('cannot overwrite a fresh explicit login with an older successful iframe result', async () => {
    await mount()
    await beginRenewal()
    await act(async () => {
      await manager.signinRedirect()
      await manager.signinRedirectCallback('http://localhost/callback?code=fresh-explicit')
    })
    expect(auth.oidcUser?.access_token).toBe(freshUser.access_token)

    await act(async () => {
      navigation.resolve({ url: 'http://localhost/callback?code=old-silent' })
    })
    expect((await manager.getUser())?.access_token).toBe(freshUser.access_token)
    expect(auth.oidcUser?.access_token).toBe(freshUser.access_token)
    expect(auth.error).toBeUndefined()
  })

  it('shares one successful silent operation and publishes its user only once', async () => {
    await mount()
    const loaded = jest.fn()
    manager.events.addUserLoaded(loaded)
    const first = manager.signinSilent()
    const second = manager.signinSilent()
    expect(first).toBe(second)
    await iframeStarted.promise
    await act(async () => {
      navigation.resolve({ url: 'http://localhost/callback?code=old-silent' })
      await Promise.all([first, second])
    })
    expect(loaded).toHaveBeenCalledTimes(1)
    expect((await manager.getUser())?.access_token).toBe(staleUser.access_token)
    expect(auth.oidcUser?.access_token).toBe(staleUser.access_token)
    expect(auth.error).toBeUndefined()
  })

  it('cannot restore a user when an explicit callback completes validation after logout', async () => {
    const validation = deferred<User>()
    const validationStarted = deferred<void>()
    jest.spyOn(UserManager.prototype, 'processSigninResponse').mockImplementationOnce(() => {
      validationStarted.resolve()
      return validation.promise as any
    })
    jest
      .spyOn(manager.metadataService, 'getEndSessionEndpoint')
      .mockRejectedValueOnce(new Error('End-session is unavailable'))
    await mount()
    let callback!: Promise<unknown>
    await act(async () => {
      callback = manager.signinRedirectCallback('http://localhost/callback?code=old-explicit').catch((error) => error)
      await validationStarted.promise
    })
    await act(async () => {
      await auth.logout()
    })
    expect(await manager.getUser()).toBeNull()
    await act(async () => {
      validation.resolve(staleUser)
      await callback
    })
    expect(await manager.getUser()).toBeNull()
    expect(auth.oidcUser).toBeUndefined()
    expect(auth.errorOperation).toBe('logout')
  })

  it('does not navigate from an unmounted callback after a newer login superseded it', async () => {
    const validation = deferred<User>()
    const validationStarted = deferred<void>()
    jest.spyOn(UserManager.prototype, 'processSigninResponse').mockImplementationOnce(() => {
      validationStarted.resolve()
      return validation.promise as any
    })
    const history = { push: jest.fn() }
    await act(async () => {
      render(<CallbackContainer history={history as any} callbackComponentOverride={<div>Callback</div>} />, element)
      await validationStarted.promise
    })
    act(() => {
      unmountComponentAtNode(element)
    })
    await manager.signinRedirect()
    await act(async () => {
      validation.resolve(staleUser)
    })
    expect(history.push).not.toHaveBeenCalled()
  })

  it.each(['success', 'failure'])(
    'does not restart login after an expired-user renewal %s was superseded by logout',
    async (outcome) => {
      const expired = user('expired-access')
      expired.expires_at = Math.floor(Date.now() / 1000) - 1
      await manager.storeUser(expired)
      const redirect = jest.spyOn(manager, 'signinRedirect')
      jest
        .spyOn(manager.metadataService, 'getEndSessionEndpoint')
        .mockRejectedValueOnce(new Error('End-session is unavailable'))
      await mount()
      let login!: Promise<unknown>
      await act(async () => {
        login = auth.login().catch((error) => error)
        await iframeStarted.promise
      })
      await act(async () => {
        await auth.logout()
      })
      await act(async () => {
        if (outcome === 'success') navigation.resolve({ url: 'http://localhost/callback?code=old-silent' })
        else navigation.reject(new Error('The old silent flow failed'))
        await login
      })
      expect(redirect).not.toHaveBeenCalled()
      expect(await manager.getUser()).toBeNull()
      expect(auth.oidcUser).toBeUndefined()
      expect(auth.errorOperation).toBe('logout')
    },
  )

  it.each(['logout', 'login'])(
    'keeps a newer %s when an old silent user-store write is already pending',
    async (action) => {
      const oldWrite = deferred<void>()
      const oldWriteStarted = deferred<void>()
      const store = manager.settings.userStore
      const set = store.set.bind(store)
      jest.spyOn(store, 'set').mockImplementation((key, value) => {
        if (value.includes(staleUser.access_token)) {
          oldWriteStarted.resolve()
          return oldWrite.promise.then(() => set(key, value))
        }
        return set(key, value)
      })
      const loaded = jest.fn()
      manager.events.addUserLoaded(loaded)
      if (action === 'logout')
        jest
          .spyOn(manager.metadataService, 'getEndSessionEndpoint')
          .mockRejectedValueOnce(new Error('End-session is unavailable'))
      await mount()
      await beginRenewal()
      await act(async () => {
        navigation.resolve({ url: 'http://localhost/callback?code=old-silent' })
        await oldWriteStarted.promise
      })
      let newer!: Promise<unknown>
      await act(async () => {
        newer =
          action === 'logout'
            ? auth.logout()
            : manager
                .signinRedirect()
                .then(() => manager.signinRedirectCallback('http://localhost/callback?code=fresh-explicit'))
        await new Promise((resolve) => setTimeout(resolve, 0))
      })
      await act(async () => {
        oldWrite.resolve()
        await newer
      })

      expect(loaded.mock.calls.map(([loadedUser]) => loadedUser.access_token)).not.toContain(staleUser.access_token)
      if (action === 'logout') {
        expect(await manager.getUser()).toBeNull()
        expect(auth.oidcUser).toBeUndefined()
        expect(auth.errorOperation).toBe('logout')
      } else {
        expect((await manager.getUser())?.access_token).toBe(freshUser.access_token)
        expect(auth.oidcUser?.access_token).toBe(freshUser.access_token)
        expect(auth.error).toBeUndefined()
      }
    },
  )
})
