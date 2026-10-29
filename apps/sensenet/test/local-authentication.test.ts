import {
  discoverAuthentication,
  getLocalRepositories,
  LocalRepositorySession,
  localSelectedRepository,
  localSessionKey,
} from '../src/services/local-authentication'

const repo = 'https://repo.example'
const endpoints = {
  issuer: repo,
  login: '/authentication/local/login',
  refresh: '/authentication/local/refresh',
  logout: '/authentication/local/logout',
  revoke: '/authentication/local/revoke',
}
const token = (subject = '1', lifetime = 300, issuer = repo) =>
  `header.${btoa(
    JSON.stringify({ sub: subject, iss: issuer, exp: Math.floor(Date.now() / 1000) + lifetime }),
  )}.signature`
const tokens = (subject = '1') => ({ accessToken: token(subject), refreshToken: 'r'.repeat(64), expiresIn: 300 })
const response = (body: any, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
const deferred = <T>() => {
  let resolve!: (value: T) => void
  let reject!: (error: Error) => void
  const promise = new Promise<T>((finish, fail) => {
    resolve = finish
    reject = fail
  })
  return { promise, resolve, reject }
}
beforeEach(() => {
  // Near-expiry fixtures must not expire during a slow or concurrent build.
  jest.spyOn(Date, 'now').mockReturnValue(Date.now())
  sessionStorage.clear()
  localStorage.clear()
})

afterEach(() => jest.restoreAllMocks())

it('keeps local sessions isolated by repository and issuer and never stores passwords', async () => {
  const request = jest.fn().mockResolvedValue(response(tokens()))
  const first = new LocalRepositorySession(repo, endpoints, request)
  await first.login('admin', 'never-store-this', '123456')
  expect(sessionStorage.getItem(localSessionKey(repo, repo))).not.toContain('never-store-this')
  expect(localStorage.length).toBe(0)
  expect(new LocalRepositorySession('https://second.example', endpoints, request).hasSession).toBe(false)
  expect(
    new LocalRepositorySession(repo, { ...endpoints, issuer: 'https://other-issuer.example' }, request).hasSession,
  ).toBe(false)
  expect(new LocalRepositorySession(repo, endpoints, request).subject).toBe('1')
})

it('refreshes once after 401 and never retries forever', async () => {
  const request = jest
    .fn()
    .mockResolvedValueOnce(response(tokens()))
    .mockResolvedValueOnce(response({}, 401))
    .mockResolvedValueOnce(response(tokens()))
    .mockResolvedValueOnce(response({}, 401))
  const session = new LocalRepositorySession(repo, endpoints, request)
  await session.login('admin', 'password')
  expect((await session.fetch(`${repo}/odata.svc/Root`)).status).toBe(401)
  expect(request).toHaveBeenCalledTimes(4)
  expect(request.mock.calls[2][0]).toBe(repo + endpoints.refresh)
  expect(session.hasSession).toBe(false)
})

it('uses only the local logout endpoint and invalidates in-flight refresh', async () => {
  let finishRefresh!: (value: Response) => void
  const request = jest
    .fn()
    .mockResolvedValueOnce(response({ ...tokens(), accessToken: token('1', 1) }))
    .mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finishRefresh = resolve
        }),
    )
    .mockResolvedValueOnce(new Response(null, { status: 204 }))
  const session = new LocalRepositorySession(repo, endpoints, request)
  await session.login('admin', 'password')
  const pending = session.fetch(`${repo}/odata.svc/Root`)
  await Promise.resolve()
  const rejected = expect(pending).rejects.toThrow('session has ended')
  await session.logout()
  finishRefresh(response(tokens()))
  await rejected
  expect(session.hasSession).toBe(false)
  expect(sessionStorage.getItem(session.storageKey)).toBeNull()
  expect(request.mock.calls[2][0]).toBe(repo + endpoints.logout)
})

it('never sends bearer tokens to another repository or follows an auth redirect', async () => {
  const request = jest.fn().mockResolvedValue(response(tokens()))
  const session = new LocalRepositorySession(`${repo}/one`, endpoints, request)
  await session.login('admin', 'password')
  await expect(session.fetch(`${repo}/two/data`)).rejects.toThrow('another repository')
  await expect(session.fetch('https://attacker.example/data')).rejects.toThrow('another repository')
  expect(request).toHaveBeenCalledTimes(1)
  expect(request.mock.calls[0][1].redirect).toBe('error')
  expect(request.mock.calls[0][1].credentials).toBe('omit')
})

it('shares one refresh between simultaneous expired-token requests', async () => {
  const request = jest
    .fn()
    .mockResolvedValueOnce(response({ ...tokens(), accessToken: token('1', 1) }))
    .mockResolvedValueOnce(response(tokens()))
    .mockImplementation(() => Promise.resolve(response({ ok: true })))
  const session = new LocalRepositorySession(repo, endpoints, request)
  await session.login('admin', 'password')
  await Promise.all([session.fetch(`${repo}/first`), session.fetch(`${repo}/second`)])
  expect(request.mock.calls.filter(([url]) => url === repo + endpoints.refresh)).toHaveLength(1)
})

it('treats only 404 as a legacy repository and rejects untrusted discovery endpoints', async () => {
  const previous = global.fetch
  try {
    global.fetch = jest.fn().mockResolvedValue(new Response(null, { status: 404 }))
    await expect(discoverAuthentication(repo)).resolves.toBeNull()
    global.fetch = jest.fn().mockResolvedValue(new Response(null, { status: 503 }))
    await expect(discoverAuthentication(repo)).rejects.toThrow()
    global.fetch = jest.fn().mockResolvedValue(
      response({
        mode: 'Secondary',
        local: { ...endpoints, login: 'https://attacker.example/login' },
        external: {},
      }),
    )
    await expect(discoverAuthentication(repo)).rejects.toThrow('Invalid authentication endpoint')
    global.fetch = jest.fn().mockResolvedValue(response({ mode: 'InternalOnly', local: endpoints, external: null }))
    await expect(discoverAuthentication(repo)).resolves.toMatchObject({ mode: 'InternalOnly' })
  } finally {
    global.fetch = previous
  }
})

it('calls the default browser transport without binding it to the session', async () => {
  const original = global.fetch
  const request = jest.fn(function (this: unknown) {
    if (this instanceof LocalRepositorySession) throw new TypeError('Illegal invocation')
    return Promise.resolve(response(tokens()))
  })
  global.fetch = request
  try {
    const session = new LocalRepositorySession(repo, endpoints)
    await session.login('admin', 'password')
    await session.fetch(`${repo}/odata.svc/Root`)
    await session.logout()
    expect(request).toHaveBeenCalledTimes(3)
  } finally {
    global.fetch = original
  }
})

it.each(['success', 'failure'])('does not restore a logged-out remount after an old refresh %s', async (outcome) => {
  const refresh = deferred<Response>()
  const request = jest
    .fn()
    .mockResolvedValueOnce(response({ ...tokens(), accessToken: token('1', 1) }))
    .mockReturnValueOnce(refresh.promise)
    .mockResolvedValueOnce(new Response(null, { status: 204 }))
  const previous = new LocalRepositorySession(repo, endpoints, request)
  await previous.login('admin', 'password')
  const pending = expect(previous.fetch(`${repo}/data`)).rejects.toThrow('session has ended')
  await Promise.resolve()
  previous.dispose()
  const current = new LocalRepositorySession(repo, endpoints, request)
  await current.logout()
  if (outcome === 'success') refresh.resolve(response(tokens()))
  else refresh.reject(new Error('Old refresh failed'))
  await pending
  expect(current.hasSession).toBe(false)
  expect(sessionStorage.getItem(current.storageKey)).toBeNull()
})

it('shares one refresh and its rotated tokens across session instances for the same repository and issuer', async () => {
  const refresh = deferred<Response>()
  const firstRequest = jest
    .fn()
    .mockResolvedValueOnce(response({ ...tokens(), accessToken: token('1', 1) }))
    .mockReturnValueOnce(refresh.promise)
    .mockResolvedValue(response({ ok: true }))
  const secondRequest = jest.fn().mockResolvedValue(response({ ok: true }))
  const first = new LocalRepositorySession(repo, endpoints, firstRequest)
  await first.login('admin', 'password')
  const firstFetch = first.fetch(`${repo}/first`)
  await Promise.resolve()
  const second = new LocalRepositorySession(repo, endpoints, secondRequest)
  const secondFetch = second.fetch(`${repo}/second`)
  const rotated = { ...tokens(), refreshToken: 'n'.repeat(64) }
  refresh.resolve(response(rotated))
  await Promise.all([firstFetch, secondFetch])
  expect(firstRequest.mock.calls.filter(([url]) => url === repo + endpoints.refresh)).toHaveLength(1)
  expect(secondRequest.mock.calls).toHaveLength(1)
  expect(second.accessToken).toBe(rotated.accessToken)
  expect(JSON.parse(sessionStorage.getItem(second.storageKey)!)).toEqual(rotated)
})

it.each(['success', 'failure'])('does not erase a new identity when an old refresh ends with %s', async (outcome) => {
  const refresh = deferred<Response>()
  const request = jest
    .fn()
    .mockResolvedValueOnce(response({ ...tokens(), accessToken: token('1', 1) }))
    .mockReturnValueOnce(refresh.promise)
    .mockResolvedValueOnce(response(tokens('2')))
  const previous = new LocalRepositorySession(repo, endpoints, request)
  await previous.login('first-user', 'password')
  const pending = expect(previous.fetch(`${repo}/data`)).rejects.toThrow('session has ended')
  await Promise.resolve()
  previous.dispose()
  const current = new LocalRepositorySession(repo, endpoints, request)
  await current.login('second-user', 'password')
  if (outcome === 'success') refresh.resolve(response(tokens('1')))
  else refresh.reject(new Error('Old refresh failed'))
  await pending
  expect(current.subject).toBe('2')
  expect(JSON.parse(sessionStorage.getItem(current.storageKey)!)).toEqual(tokens('2'))
})

it.each(['success', 'failure'])('does not let a disposed login %s overwrite a later login', async (outcome) => {
  const login = deferred<Response>()
  const previous = new LocalRepositorySession(repo, endpoints, jest.fn().mockReturnValue(login.promise))
  const pending = expect(previous.login('first-user', 'password')).rejects.toThrow()
  previous.dispose()
  const current = new LocalRepositorySession(repo, endpoints, jest.fn().mockResolvedValue(response(tokens('2'))))
  await current.login('second-user', 'password')
  if (outcome === 'success') login.resolve(response(tokens('1')))
  else login.reject(new Error('Old login failed'))
  await pending
  expect(current.subject).toBe('2')
  expect(JSON.parse(sessionStorage.getItem(current.storageKey)!)).toEqual(tokens('2'))
})

it('does not change the selected repository when a disposed provider finishes a refresh', async () => {
  const refresh = deferred<Response>()
  const request = jest
    .fn()
    .mockResolvedValueOnce(response({ ...tokens(), accessToken: token('1', 1) }))
    .mockReturnValueOnce(refresh.promise)
  const previous = new LocalRepositorySession(repo, endpoints, request)
  await previous.login('admin', 'password')
  const pending = expect(previous.fetch(`${repo}/data`)).rejects.toThrow('Session has ended')
  await Promise.resolve()
  previous.dispose()
  const otherRepo = 'https://other.example'
  const otherTokens = { ...tokens(), accessToken: token('2', 300, otherRepo) }
  const other = new LocalRepositorySession(
    otherRepo,
    { ...endpoints, issuer: otherRepo },
    jest.fn().mockResolvedValue(response(otherTokens)),
  )
  await other.login('other-user', 'password')
  refresh.resolve(response(tokens()))
  await pending
  expect(sessionStorage.getItem(localSelectedRepository)).toBe(otherRepo)
  expect(other.subject).toBe('2')
  expect(new LocalRepositorySession(repo, endpoints).hasSession).toBe(true)
})

it('keeps another issuer session and repository entry when one issuer logs out', async () => {
  const first = new LocalRepositorySession(repo, endpoints, jest.fn().mockResolvedValue(response(tokens())))
  await first.login('first-user', 'password')
  const issuer = 'https://other-issuer.example'
  const otherTokens = { ...tokens(), accessToken: token('2', 300, issuer) }
  const other = new LocalRepositorySession(
    repo,
    { ...endpoints, issuer },
    jest.fn().mockResolvedValue(response(otherTokens)),
  )
  await other.login('other-user', 'password')
  await first.logout()
  expect(first.hasSession).toBe(false)
  expect(other.subject).toBe('2')
  expect(sessionStorage.getItem(other.storageKey)).not.toBeNull()
  expect(getLocalRepositories()).toContain(repo)
})

it('does not clear a newer login when an older password reset completes', async () => {
  const reset = deferred<Response>()
  const request = jest
    .fn()
    .mockResolvedValueOnce(response(tokens()))
    .mockReturnValueOnce(reset.promise)
    .mockResolvedValueOnce(response(tokens('2')))
  const session = new LocalRepositorySession(
    repo,
    { ...endpoints, resetPassword: '/authentication/local/reset-password' },
    request,
  )
  await session.login('first-user', 'password')
  const pending = expect(session.resetPassword('reset-token', 'new-password')).rejects.toThrow('Session has ended')
  await session.login('second-user', 'password')
  reset.resolve(new Response(null, { status: 204 }))
  await pending
  expect(session.subject).toBe('2')
})

it('rejects a verification challenge from an ended session before sending an MFA request', async () => {
  const request = jest.fn().mockResolvedValue(response({ challengeToken: 'c'.repeat(64), expiresIn: 120 }, 202))
  const session = new LocalRepositorySession(repo, { ...endpoints, mfa: '/authentication/local/mfa' }, request)
  await session.beginLogin('admin', 'password')
  await session.logout()
  await expect(session.completeMfa('c'.repeat(64), '123456')).rejects.toThrow('Verification challenge has ended')
  expect(request).toHaveBeenCalledTimes(1)
})

it('waits for an active shared refresh before retrying a delayed 401 from an older token', async () => {
  const oldResponse = deferred<Response>()
  const latestRefresh = deferred<Response>()
  const latestRefreshStarted = deferred<void>()
  const initial = tokens()
  const intermediate = { ...tokens(), accessToken: `${token()}-second`, refreshToken: 's'.repeat(64) }
  const latest = { ...tokens(), accessToken: `${token()}-third`, refreshToken: 't'.repeat(64) }
  let refreshCount = 0
  let oldCount = 0
  let rotationCount = 0
  const request = jest.fn(async (input: RequestInfo) => {
    const url = typeof input === 'string' ? input : input.url
    if (url === repo + endpoints.login) return response(initial)
    if (url === repo + endpoints.refresh) {
      if (++refreshCount === 1) return response(intermediate)
      latestRefreshStarted.resolve()
      return latestRefresh.promise
    }
    if (url.endsWith('/old') && ++oldCount === 1) return oldResponse.promise
    if (url.endsWith('/rotation')) return ++rotationCount === 1 ? response({}, 401) : response({ ok: true })
    const authorized = input instanceof Request && input.headers.get('Authorization') === `Bearer ${latest.accessToken}`
    return response({}, authorized ? 200 : 401)
  })
  const first = new LocalRepositorySession(repo, endpoints, request)
  await first.login('admin', 'password')
  const oldRequest = first.fetch(`${repo}/old`).then(
    (result) => result.status,
    (error) => error.message,
  )
  await first.fetch(`${repo}/rotation`)
  const second = new LocalRepositorySession(repo, endpoints, request)
  const currentRequest = second.fetch(`${repo}/current`).then(
    (result) => result.status,
    (error) => error.message,
  )
  await latestRefreshStarted.promise
  oldResponse.resolve(response({}, 401))
  await new Promise((resolve) => setTimeout(resolve, 0))
  expect(oldCount).toBe(1)
  latestRefresh.resolve(response(latest))
  expect(await Promise.all([oldRequest, currentRequest])).toEqual([200, 200])
  expect(first.accessToken).toBe(latest.accessToken)
  expect(second.accessToken).toBe(latest.accessToken)
  expect(refreshCount).toBe(2)
})

it('does not clear a newer token when an older retry eventually returns 401', async () => {
  const oldRetry = deferred<Response>()
  const oldRetryStarted = deferred<void>()
  const intermediate = { ...tokens(), accessToken: `${token()}-second`, refreshToken: 's'.repeat(64) }
  const latest = { ...tokens(), accessToken: `${token()}-third`, refreshToken: 't'.repeat(64) }
  let refreshCount = 0
  let oldCount = 0
  let currentCount = 0
  const request = jest.fn(async (input: RequestInfo) => {
    const url = typeof input === 'string' ? input : input.url
    if (url === repo + endpoints.login) return response(tokens())
    if (url === repo + endpoints.refresh) return response(++refreshCount === 1 ? intermediate : latest)
    if (url.endsWith('/old')) {
      if (++oldCount === 1) return response({}, 401)
      oldRetryStarted.resolve()
      return oldRetry.promise
    }
    return ++currentCount === 1 ? response({}, 401) : response({ ok: true })
  })
  const session = new LocalRepositorySession(repo, endpoints, request)
  await session.login('admin', 'password')
  const oldRequest = session.fetch(`${repo}/old`)
  await oldRetryStarted.promise
  await session.fetch(`${repo}/current`)
  oldRetry.resolve(response({}, 401))
  expect((await oldRequest).status).toBe(401)
  expect(session.hasSession).toBe(true)
  expect(session.accessToken).toBe(latest.accessToken)
  expect(JSON.parse(sessionStorage.getItem(session.storageKey)!)).toEqual(latest)
  expect(oldCount).toBe(2)
  expect(refreshCount).toBe(2)
})
