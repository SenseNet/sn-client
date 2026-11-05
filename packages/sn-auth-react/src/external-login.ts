const pendingLifetime = 10 * 60 * 1000
const pendingKeyPrefix = 'sn-auth-pending-login:'

type LoginTarget = { repoUrl: string; authServerUrl: string; callbackUri: string }
type PendingLogin = LoginTarget & { state: string; codeVerifier: string; createdAt: number }

const normalize = (url: string) => url.replace(/\/+$/, '')
const keyFor = ({ repoUrl, authServerUrl, callbackUri }: LoginTarget) =>
  `${pendingKeyPrefix}${encodeURIComponent(normalize(repoUrl))}:${encodeURIComponent(
    normalize(authServerUrl),
  )}:${encodeURIComponent(callbackUri)}`
const base64Url = (bytes: Uint8Array) =>
  window
    .btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

export const clearPendingExternalLogin = (target: LoginTarget) => window.sessionStorage.removeItem(keyFor(target))

const readPending = (key: string): PendingLogin | undefined => {
  try {
    return JSON.parse(window.sessionStorage.getItem(key) || 'null') || undefined
  } catch {
    return undefined
  }
}

const usablePending = (pending: PendingLogin | undefined, state: string | null, callbackUri: string) =>
  !!state &&
  !!pending &&
  pending.state === state &&
  typeof pending.repoUrl === 'string' &&
  typeof pending.authServerUrl === 'string' &&
  pending.callbackUri === callbackUri &&
  /^[A-Za-z0-9_-]{43}$/.test(pending.codeVerifier) &&
  Number.isFinite(pending.createdAt) &&
  pending.createdAt <= Date.now() &&
  Date.now() - pending.createdAt <= pendingLifetime

/** Find a callback's tab-local target without consuming its one-use state. */
export function getPendingExternalLoginTarget(callbackUri: string, state: string | null): LoginTarget | undefined {
  for (let index = 0; index < window.sessionStorage.length; index++) {
    const key = window.sessionStorage.key(index)
    if (!key?.startsWith(pendingKeyPrefix)) continue
    const pending = readPending(key)
    if (usablePending(pending, state, callbackUri) && key === keyFor(pending!)) {
      return { repoUrl: pending!.repoUrl, authServerUrl: pending!.authServerUrl, callbackUri }
    }
  }
  return undefined
}

/** Prepare an authorization request bound to this tab and repository. */
export async function prepareExternalLogin(target: LoginTarget, isActive: () => boolean = () => true): Promise<string> {
  if (!window.crypto?.getRandomValues || !window.crypto.subtle) {
    throw new Error('Secure browser cryptography is unavailable. Sign in from HTTPS or localhost.')
  }
  const state = base64Url(window.crypto.getRandomValues(new Uint8Array(32)))
  const codeVerifier = base64Url(window.crypto.getRandomValues(new Uint8Array(32)))
  const challenge = base64Url(
    new Uint8Array(await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(codeVerifier))),
  )
  const pending: PendingLogin = {
    repoUrl: normalize(target.repoUrl),
    authServerUrl: normalize(target.authServerUrl),
    callbackUri: target.callbackUri,
    state,
    codeVerifier,
    createdAt: Date.now(),
  }
  if (!isActive()) throw new Error('Sign-in was cancelled.')
  window.sessionStorage.setItem(keyFor(target), JSON.stringify(pending))
  const url = new URL(`${normalize(target.authServerUrl)}/Login`)
  url.search = new URLSearchParams({
    RedirectUrl: window.location.origin,
    CallbackUri: target.callbackUri,
    state,
    codeChallenge: challenge,
    codeChallengeMethod: 'S256',
  }).toString()
  return url.href
}

/** Consume a matching pending request before exchanging its authorization code. */
export function consumeExternalLogin(target: LoginTarget, state: string | null): string {
  const pending = readPending(keyFor(target))
  if (
    !usablePending(pending, state, target.callbackUri) ||
    !pending ||
    pending.repoUrl !== normalize(target.repoUrl) ||
    pending.authServerUrl !== normalize(target.authServerUrl)
  ) {
    throw new Error('The sign-in response does not match an active login. Start sign-in again.')
  }
  clearPendingExternalLogin(target)
  return pending.codeVerifier
}
