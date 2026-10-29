import { convertAuthTokenApiCall, logoutApiCall } from '../src/server-actions'

const previousFetch = global.fetch
beforeEach(() => jest.useFakeTimers())
afterEach(() => {
  global.fetch = previousFetch
  jest.useRealTimers()
  jest.restoreAllMocks()
})

it('sends the code verifier only in the conversion POST body', async () => {
  const request = jest
    .fn()
    .mockResolvedValue({ ok: true, json: async () => ({ accessToken: 'access', refreshToken: 'refresh' }) })
  global.fetch = request
  await convertAuthTokenApiCall('https://auth.example.invalid', 'auth-code', 'tab-only-verifier')
  expect(request.mock.calls[0][0]).toBe('https://auth.example.invalid/api/auth/convert-auth-token')
  expect(JSON.parse(request.mock.calls[0][1].body)).toEqual({ token: 'auth-code', codeVerifier: 'tab-only-verifier' })
})

it('aborts an unresponsive server logout after five seconds', async () => {
  let signal!: AbortSignal
  global.fetch = jest.fn((_url, options: any) => {
    ;({ signal } = options)
    return new Promise((_resolve, reject) =>
      signal.addEventListener('abort', () => reject(new Error('Request aborted'))),
    )
  }) as any
  jest.spyOn(console, 'error').mockImplementation(() => {})
  const result = logoutApiCall('https://auth.example.invalid', 'access')
  const rejection = expect(result).rejects.toThrow('Request aborted')
  jest.advanceTimersByTime(5000)
  await rejection
  expect(signal.aborted).toBe(true)
  expect(jest.getTimerCount()).toBe(0)
})

it('cancels the timeout when revocation succeeds', async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: true })
  await expect(logoutApiCall('https://auth.example.invalid', 'access')).resolves.toBe(true)
  expect(jest.getTimerCount()).toBe(0)
})
