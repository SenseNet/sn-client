import { createHash, webcrypto } from 'crypto'
import { TextEncoder } from 'util'
import { consumeExternalLogin, getPendingExternalLoginTarget, prepareExternalLogin } from '../src/external-login'

const target = {
  repoUrl: 'https://repo.example.invalid',
  authServerUrl: 'https://auth.example.invalid',
  callbackUri: '/callback',
}
const originalCrypto = window.crypto
const originalEncoder = global.TextEncoder
beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
  Object.defineProperty(window, 'crypto', { configurable: true, value: webcrypto })
  global.TextEncoder = TextEncoder as any
})
afterEach(() => {
  Object.defineProperty(window, 'crypto', { configurable: true, value: originalCrypto })
  global.TextEncoder = originalEncoder
  jest.restoreAllMocks()
})

it('binds each outbound login to tab-local state and an S256 verifier', async () => {
  const url = new URL(await prepareExternalLogin(target))
  const state = url.searchParams.get('state')!
  const verifier = consumeExternalLogin(target, state)
  const challenge = createHash('sha256').update(verifier).digest('base64url')
  expect(state).toMatch(/^[A-Za-z0-9_-]{43}$/)
  expect(verifier).toMatch(/^[A-Za-z0-9_-]{43}$/)
  expect(url.origin + url.pathname).toBe(`${target.authServerUrl}/Login`)
  expect(url.searchParams.get('RedirectUrl')).toBe(window.location.origin)
  expect(url.searchParams.get('CallbackUri')).toBe('/callback')
  expect(url.searchParams.get('codeChallengeMethod')).toBe('S256')
  expect(url.searchParams.get('codeChallenge')).toBe(challenge)
  expect(url.searchParams.has('codeVerifier')).toBe(false)
  expect(localStorage.length).toBe(0)
  expect(sessionStorage.length).toBe(0)
})

it.each([null, '', 'another-login'])(
  'rejects a missing or mismatched state (%s) before consuming a valid login',
  async (wrong) => {
    const url = new URL(await prepareExternalLogin(target))
    expect(() => consumeExternalLogin(target, wrong)).toThrow('does not match an active login')
    expect(consumeExternalLogin(target, url.searchParams.get('state'))).toMatch(/^[A-Za-z0-9_-]{43}$/)
  },
)

it('rejects replayed authorization callbacks', async () => {
  const url = new URL(await prepareExternalLogin(target))
  consumeExternalLogin(target, url.searchParams.get('state'))
  expect(() => consumeExternalLogin(target, url.searchParams.get('state'))).toThrow('does not match an active login')
})

it('looks up a callback target without consuming or disclosing its verifier', async () => {
  const url = new URL(await prepareExternalLogin(target))
  const state = url.searchParams.get('state')
  expect(getPendingExternalLoginTarget(target.callbackUri, state)).toEqual(target)
  expect(getPendingExternalLoginTarget('/another-callback', state)).toBeUndefined()
  expect(getPendingExternalLoginTarget(target.callbackUri, 'unknown')).toBeUndefined()
  expect(consumeExternalLogin(target, state)).toMatch(/^[A-Za-z0-9_-]{43}$/)
  expect(getPendingExternalLoginTarget(target.callbackUri, state)).toBeUndefined()
})

it.each(['repoUrl', 'authServerUrl', 'callbackUri'] as const)('does not consume another %s login', async (field) => {
  const url = new URL(await prepareExternalLogin(target))
  const other = { ...target, [field]: field === 'callbackUri' ? '/another-callback' : 'https://other.example.invalid' }
  expect(() => consumeExternalLogin(other, url.searchParams.get('state'))).toThrow('does not match an active login')
  expect(consumeExternalLogin(target, url.searchParams.get('state'))).toBeTruthy()
})

it('rejects expired pending state', async () => {
  const url = new URL(await prepareExternalLogin(target))
  const now = Date.now()
  jest.spyOn(Date, 'now').mockReturnValue(now + 10 * 60 * 1000 + 1)
  expect(() => consumeExternalLogin(target, url.searchParams.get('state'))).toThrow('does not match an active login')
})

it('keeps independent repository login attempts', async () => {
  const other = { ...target, repoUrl: 'https://second.example.invalid' }
  const first = new URL(await prepareExternalLogin(target))
  const second = new URL(await prepareExternalLogin(other))
  expect(first.searchParams.get('state')).not.toBe(second.searchParams.get('state'))
  consumeExternalLogin(target, first.searchParams.get('state'))
  expect(consumeExternalLogin(other, second.searchParams.get('state'))).toBeTruthy()
})

it('does not create pending state when the initiating operation has already ended', async () => {
  await expect(prepareExternalLogin(target, () => false)).rejects.toThrow('Sign-in was cancelled')
  expect(sessionStorage.length).toBe(0)
})

it('fails closed when browser cryptography is unavailable', async () => {
  Object.defineProperty(window, 'crypto', { configurable: true, value: {} })
  await expect(prepareExternalLogin(target)).rejects.toThrow('Secure browser cryptography is unavailable')
  expect(sessionStorage.length).toBe(0)
})
