import { discoverAuthentication, LocalRepositorySession, localSessionKey } from '../src/services/local-authentication'

const repo = 'https://repo.example'
const endpoints = {
  issuer: repo,
  login: '/authentication/local/login',
  refresh: '/authentication/local/refresh',
  logout: '/authentication/local/logout',
  revoke: '/authentication/local/revoke',
}
const token = (subject = '1', lifetime = 300) =>
  `header.${btoa(JSON.stringify({ sub: subject, iss: repo, exp: Math.floor(Date.now() / 1000) + lifetime }))}.signature`
const tokens = (subject = '1') => ({ accessToken: token(subject), refreshToken: 'r'.repeat(64), expiresIn: 300 })
const response = (body: any, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
beforeEach(() => {
  sessionStorage.clear()
  localStorage.clear()
})

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
