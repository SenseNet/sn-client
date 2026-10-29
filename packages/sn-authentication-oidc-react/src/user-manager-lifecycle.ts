import { User, UserManager, UserManagerSettings, WebStorageStateStore } from 'oidc-client'

class SupersededOidcOperation extends Error {
  constructor() {
    super('The authentication operation has ended.')
  }
}

type Logout = { depth: number }
type Lifecycle = {
  generation: number
  signedOut: boolean
  logout?: Logout
  writes: Promise<void>
  silent?: { generation: number; promise: Promise<User> }
}

const lifecycles = new WeakMap<UserManager, Lifecycle>()
export const isSupersededOidcOperation = (error: unknown) => error instanceof SupersededOidcOperation

const assertCurrent = (state: Lifecycle, generation: number) => {
  if (state.generation !== generation) throw new SupersededOidcOperation()
}

const write = (state: Lifecycle, generation: number, operation: () => Promise<void>) => {
  const pending = state.writes.then(async () => {
    assertCurrent(state, generation)
    await operation()
    assertCurrent(state, generation)
  })
  // Serialize user-store mutations, including custom asynchronous stores. A newer
  // clear/save follows an already-started old write; no rollback can erase it.
  state.writes = pending.catch(() => {})
  return pending
}

export const runOidcLogout = async (manager: UserManager, operation: (ensureCurrent: () => void) => Promise<void>) => {
  const state = lifecycles.get(manager)
  if (!state) return operation(() => {})
  if (!state.logout) {
    state.logout = { depth: 0 }
    state.generation++
    state.signedOut = true
    state.silent = undefined
    manager.stopSilentRenew()
  }
  const { logout } = state
  logout.depth++
  const ensureCurrent = () => {
    if (state.logout !== logout) throw new SupersededOidcOperation()
  }
  try {
    await operation(ensureCurrent)
    ensureCurrent()
  } catch (error) {
    ensureCurrent()
    throw error
  } finally {
    logout.depth--
    if (!logout.depth && state.logout === logout) await manager.removeUser()
  }
}

/** Coordinate public OIDC operations without modifying oidc-client's response processing. */
export const coordinateUserManager = (manager: UserManager, configuration: UserManagerSettings) => {
  if (lifecycles.has(manager)) return manager
  const state: Lifecycle = { generation: 0, signedOut: false, writes: Promise.resolve() }
  lifecycles.set(manager, state)
  const storeUser = manager.storeUser.bind(manager)
  const signinRedirect = manager.signinRedirect.bind(manager)
  const signoutRedirect = manager.signoutRedirect.bind(manager)
  const signoutPopup = manager.signoutPopup.bind(manager)

  const beginLogin = () => {
    state.generation++
    state.signedOut = false
    state.logout = undefined
    state.silent = undefined
    return state.generation
  }
  const explicitLogin = <T>(operation: () => Promise<T>) => {
    const generation = beginLogin()
    return operation().catch((error) => {
      assertCurrent(state, generation)
      throw error
    })
  }

  manager.storeUser = (user) => {
    state.generation++
    state.silent = undefined
    state.signedOut = !user
    if (user) state.logout = undefined
    else {
      state.logout = state.logout || { depth: 0 }
      manager.stopSilentRenew()
    }
    const { generation } = state
    return write(state, generation, () => storeUser(user)).then(() => {
      if (user && configuration.automaticSilentRenew) manager.startSilentRenew()
    })
  }
  manager.signinRedirect = (args) => explicitLogin(() => signinRedirect(args))
  manager.signoutRedirect = (args) => runOidcLogout(manager, async () => await signoutRedirect(args))
  manager.signoutPopup = (args) => runOidcLogout(manager, async () => await signoutPopup(args))

  const userFlow = (generation: number, operation: (flow: UserManager) => Promise<User>) => {
    const source = manager.settings.userStore!
    const staged = new Map<string, any>()
    const ensureCurrent = () => {
      assertCurrent(state, generation)
      if (state.signedOut) throw new SupersededOidcOperation()
    }
    // A response may finish parsing after logout or another login. Its UserManager
    // writes only here until the response has passed the lifecycle check.
    const userStore: WebStorageStateStore = {
      get: async (key) => {
        ensureCurrent()
        return staged.has(key) ? staged.get(key) : source.get(key)
      },
      set: async (key, value) => {
        ensureCurrent()
        staged.set(key, value)
      },
      remove: async (key) => {
        ensureCurrent()
        const value = staged.has(key) ? staged.get(key) : await source.get(key)
        ensureCurrent()
        staged.set(key, null)
        return value
      },
      getAllKeys: async () => [...new Set([...(await source.getAllKeys()), ...staged.keys()])],
    }
    let flow: UserManager | undefined
    return (async () => {
      try {
        await state.writes
        ensureCurrent()
        const metadata = await manager.metadataService.getMetadata()
        ensureCurrent()
        flow = new UserManager({
          ...configuration,
          metadata,
          userStore,
          stateStore: manager.settings.stateStore,
          automaticSilentRenew: false,
          monitorSession: false,
        })
        const user = await operation(flow)
        ensureCurrent()
        if (user) {
          await write(state, generation, () => storeUser(user))
          ensureCurrent()
          if (configuration.automaticSilentRenew) manager.startSilentRenew()
          manager.events.load(user)
        }
        return user
      } catch (error) {
        ensureCurrent()
        throw error
      } finally {
        flow?.stopSilentRenew()
        flow?.events.unload()
      }
    })()
  }
  manager.signinRedirectCallback = (url) => userFlow(beginLogin(), (flow) => flow.signinRedirectCallback(url))
  manager.signinPopup = (args) => userFlow(beginLogin(), (flow) => flow.signinPopup(args))
  manager.signinSilent = (args) => {
    if (state.signedOut) return Promise.reject(new SupersededOidcOperation())
    if (state.silent?.generation === state.generation) return state.silent.promise
    const { generation } = state
    const promise = userFlow(generation, (flow) => flow.signinSilent(args)).finally(() => {
      if (state.silent?.generation === generation) state.silent = undefined
    })
    state.silent = { generation, promise }
    return promise
  }
  return manager
}
