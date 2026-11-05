import { normalizeRepositoryUrl } from './repository-session'

export type LocalLoginAppearance = {
  title?: string
  backgroundImageUrl?: string
  logoUrl?: string
  backgroundColor?: string
  brandColor?: string
  buttonColor?: string
  buttonTextColor?: string
  textColor?: string
  panelColor?: string
}
export type LocalMfaChallenge = {
  challengeToken: string
  expiresIn: number
  manualEntryKey?: string
  qrCodeSetupImageUrl?: string
}
const operationPaths = {
  login: '/authentication/local/login',
  refresh: '/authentication/local/refresh',
  logout: '/authentication/local/logout',
  mfa: '/authentication/local/mfa',
  forgotPassword: '/authentication/local/forgot-password',
  resetPassword: '/authentication/local/reset-password',
}
export type LocalEndpoints = {
  issuer: string
  login: string
  refresh: string
  logout: string
  revoke: string
  mfa?: string
  forgotPassword?: string | null
  resetPassword?: string | null
  minimumPasswordLength?: number
  appearance?: LocalLoginAppearance
}
export type RepositoryAuthCapabilities = {
  mode: 'Disabled' | 'Secondary' | 'InternalOnly'
  local: LocalEndpoints | null
  external: { authority?: string } | null
}
export const localSessionsChanged = 'sn-local-sessions-changed'
export const localSelectedRepository = 'sn-local-selected-repository'
const localRepositoriesKey = 'sn-local-repositories'

export async function discoverAuthentication(repoUrl: string, signal?: AbortSignal) {
  const repository = normalizeRepositoryUrl(repoUrl)
  const response = await fetch(`${repository}/authentication/capabilities`, {
    credentials: 'omit',
    redirect: 'error',
    cache: 'no-store',
    signal,
  })
  if (response.status === 404) return null
  if (!response.ok) throw new Error('Could not discover repository authentication.')
  const data = (await response.json()) as RepositoryAuthCapabilities
  if (!['Disabled', 'Secondary', 'InternalOnly'].includes(data.mode))
    throw new Error('Invalid authentication capabilities.')
  if (data.local) {
    if (new URL(repository).protocol !== 'https:' || new URL(data.local.issuer).protocol !== 'https:') {
      throw new Error('Internal authentication requires HTTPS.')
    }
    for (const operation of ['mfa', 'forgotPassword', 'resetPassword'] as const) {
      if (data.local[operation] && data.local[operation] !== operationPaths[operation])
        throw new Error('Invalid authentication endpoint.')
    }
    for (const operation of ['login', 'refresh', 'logout', 'revoke'] as const) {
      if (data.local[operation] !== `/authentication/local/${operation}`)
        throw new Error('Invalid authentication endpoint.')
    }
  }
  return data
}

type Tokens = { accessToken: string; refreshToken: string; expiresIn: number }
type LocalSessionState = {
  tokens?: Tokens
  saved: string | null
  generation: number
  refreshing?: Promise<void>
  listeners: Set<() => void>
}
// sessionStorage is shared by every session instance in this tab. Its lifecycle must be shared too.
const sessionStates = new Map<string, LocalSessionState>()
type TokenClaims = { exp: number; sub: string; iss: string }
const claims = (token: string): TokenClaims => {
  const part = token.split('.')[1]
  const base64 = part.replace(/-/g, '+').replace(/_/g, '/')
  return JSON.parse(atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')))
}
export const localSessionKey = (repoUrl: string, issuer: string) =>
  `sn-local:${encodeURIComponent(normalizeRepositoryUrl(repoUrl))}:${encodeURIComponent(issuer)}`

export function getLocalRepositories(): string[] {
  try {
    const value = JSON.parse(sessionStorage.getItem(localRepositoriesKey) || '[]')
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []
  } catch {
    return []
  }
}

/** An explicit human-login session. Passwords are never retained in configuration or storage. */
export class LocalRepositorySession {
  private readonly state: LocalSessionState
  private disposed = false
  private challenge?: { token: string; generation: number }
  private readonly notify = () => this.onChange?.()
  readonly repositoryUrl: string
  readonly storageKey: string

  constructor(
    repoUrl: string,
    readonly endpoints: LocalEndpoints,
    private request: typeof fetch = (...args) => fetch(...args),
  ) {
    this.repositoryUrl = normalizeRepositoryUrl(repoUrl)
    if (new URL(this.repositoryUrl).protocol !== 'https:') throw new Error('Internal authentication requires HTTPS.')
    this.storageKey = localSessionKey(this.repositoryUrl, endpoints.issuer)
    const existing = sessionStates.get(this.storageKey)
    this.state = existing || { saved: null, generation: 0, listeners: new Set() }
    sessionStates.set(this.storageKey, this.state)
    const saved = sessionStorage.getItem(this.storageKey)
    if (saved !== this.state.saved) {
      // A new document/storage reset must also invalidate pending work from older instances.
      this.state.generation++
      this.state.refreshing = undefined
      try {
        this.state.tokens = saved ? this.validateTokens(JSON.parse(saved), false) : undefined
        this.state.saved = saved
        this.changed()
      } catch {
        this.clearSession()
      }
    }
    this.state.listeners.add(this.notify)
  }

  onChange?: () => void
  private get tokens() {
    return this.state.tokens
  }
  private get generation() {
    return this.state.generation
  }
  get revision() {
    return this.generation
  }
  get accessToken() {
    return this.tokens?.accessToken
  }
  get hasSession() {
    return !!this.tokens
  }
  get subject() {
    return this.tokens ? claims(this.tokens.accessToken).sub : undefined
  }

  /** Detach this provider without signing out a repository that may be selected again. */
  dispose() {
    this.disposed = true
    this.challenge = undefined
    this.state.listeners.delete(this.notify)
    this.onChange = undefined
  }

  private ensureActive() {
    if (this.disposed) throw new Error('Session has ended.')
  }

  private ensureCurrent(generation: number) {
    this.ensureActive()
    if (generation !== this.generation) throw new Error('Session has ended.')
  }

  private changed() {
    this.state.listeners.forEach((listener) => listener())
    window.dispatchEvent(new Event(localSessionsChanged))
  }

  private validateTokens(tokens: Tokens, requireFresh = true) {
    const decoded = claims(tokens.accessToken)
    if (
      typeof tokens.refreshToken !== 'string' ||
      tokens.refreshToken.length !== 64 ||
      !decoded.sub ||
      decoded.iss !== this.endpoints.issuer ||
      !Number.isFinite(decoded.exp) ||
      (requireFresh && decoded.exp * 1000 <= Date.now())
    ) {
      throw new Error('Invalid internal authentication response.')
    }
    return tokens
  }

  private save(tokens: Tokens, generation: number, selectRepository = false) {
    if (generation !== this.generation) throw new Error('Session has ended.')
    const validated = this.validateTokens(tokens)
    if (this.tokens && claims(validated.accessToken).sub !== this.subject)
      throw new Error('Internal authentication changed identity.')
    this.state.tokens = validated
    this.state.saved = JSON.stringify(validated)
    sessionStorage.setItem(this.storageKey, this.state.saved)
    sessionStorage.setItem(
      localRepositoriesKey,
      JSON.stringify([...new Set([...getLocalRepositories(), this.repositoryUrl])]),
    )
    if (selectRepository) sessionStorage.setItem(localSelectedRepository, this.repositoryUrl)
    this.changed()
  }

  clear() {
    this.ensureActive()
    this.clearSession()
  }

  private clearSession() {
    this.state.generation++
    this.state.tokens = undefined
    this.state.saved = null
    this.state.refreshing = undefined
    this.challenge = undefined
    sessionStorage.removeItem(this.storageKey)
    const prefix = `sn-local:${encodeURIComponent(this.repositoryUrl)}:`
    const otherIssuerHasSession = Array.from({ length: sessionStorage.length }, (_, index) =>
      sessionStorage.key(index),
    ).some((key) => key?.startsWith(prefix) && sessionStorage.getItem(key))
    if (!otherIssuerHasSession)
      sessionStorage.setItem(
        localRepositoriesKey,
        JSON.stringify(getLocalRepositories().filter((url) => url !== this.repositoryUrl)),
      )
    this.changed()
  }

  private async post(operation: keyof typeof operationPaths, body: object) {
    // Only fixed repository-relative paths: discovery cannot redirect credentials to another issuer.
    if (this.endpoints[operation] !== operationPaths[operation]) throw new Error('Invalid authentication endpoint.')
    const response = await this.request(`${this.repositoryUrl}${this.endpoints[operation]}`, {
      method: 'POST',
      credentials: 'omit',
      redirect: 'error',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!response.ok) throw new Error('Internal authentication failed.')
    return response
  }

  async login(username: string, password: string, twoFactorCode?: string) {
    this.clear()
    const { generation } = this
    const response = await this.post('login', { username, password, twoFactorCode })
    const tokens = await response.json()
    this.ensureCurrent(generation)
    this.save(tokens, generation, true)
  }

  async beginLogin(username: string, password: string, twoFactorCode?: string): Promise<LocalMfaChallenge | undefined> {
    if (!this.endpoints.mfa) {
      await this.login(username, password, twoFactorCode)
      return
    }
    this.clear()
    const { generation } = this
    const response = await this.post('login', { username, password, requestMfaChallenge: true })
    const data = await response.json()
    this.ensureCurrent(generation)
    if (response.status === 202) {
      if (
        typeof data.challengeToken !== 'string' ||
        !/^[A-Za-z0-9_-]{64}$/.test(data.challengeToken) ||
        !Number.isFinite(data.expiresIn) ||
        data.expiresIn <= 0 ||
        data.expiresIn > 300
      )
        throw new Error('Invalid verification challenge.')
      this.challenge = { token: data.challengeToken, generation }
      return data
    }
    this.save(data, generation, true)
  }

  async completeMfa(challengeToken: string, twoFactorCode: string) {
    this.ensureActive()
    const pending = this.challenge
    if (!pending || pending.token !== challengeToken) throw new Error('Verification challenge has ended.')
    const { generation } = pending
    this.ensureCurrent(generation)
    const response = await this.post('mfa', { challengeToken, twoFactorCode })
    const tokens = await response.json()
    this.ensureCurrent(generation)
    this.save(tokens, generation, true)
    this.challenge = undefined
  }

  async forgotPassword(email: string) {
    this.ensureActive()
    await this.post('forgotPassword', { email })
  }

  async resetPassword(token: string, password: string) {
    this.ensureActive()
    const { generation } = this
    await this.post('resetPassword', { token, password })
    this.ensureCurrent(generation)
    this.clear()
  }

  private async refresh() {
    this.ensureActive()
    if (this.state.refreshing) return this.state.refreshing
    const { generation } = this
    const refreshToken = this.tokens?.refreshToken
    if (!refreshToken) throw new Error('Sign in again.')
    const operation = (async () => {
      try {
        const response = await this.post('refresh', { refreshToken })
        this.save(await response.json(), generation)
      } catch {
        if (generation === this.generation) this.clearSession()
        throw new Error('Your internal session has ended. Sign in again.')
      }
    })()
    this.state.refreshing = operation
    try {
      await operation
    } finally {
      if (this.state.refreshing === operation) this.state.refreshing = undefined
    }
  }

  async logout() {
    const refreshToken = this.tokens?.refreshToken
    this.clear()
    if (refreshToken) await this.post('logout', { refreshToken })
  }

  /** Same-repository bearer transport with one refresh/retry after 401. */
  readonly fetch: typeof fetch = async (input, init) => {
    this.ensureActive()
    const original = new Request(input, init)
    const target = new URL(original.url)
    const base = new URL(this.repositoryUrl)
    if (
      target.origin !== base.origin ||
      !(target.pathname === base.pathname || target.pathname.startsWith(`${base.pathname.replace(/\/$/, '')}/`))
    ) {
      throw new Error('Cannot send an internal session to another repository.')
    }
    if (!this.tokens) throw new Error('Sign in again.')
    const { generation } = this
    if (claims(this.tokens.accessToken).exp * 1000 <= Date.now() + 10000) await this.refresh()
    const send = () => {
      this.ensureCurrent(generation)
      if (generation !== this.generation || !this.tokens) throw new Error('Your session has ended. Sign in again.')
      const headers = new Headers(original.headers)
      headers.set('Authorization', `Bearer ${this.tokens!.accessToken}`)
      return this.request(new Request(original.clone(), { headers, credentials: 'omit', redirect: 'error' }))
    }
    const usedToken = this.tokens?.accessToken
    let response = await send()
    this.ensureCurrent(generation)
    if (response.status === 401) {
      // Another request may already be rotating the token that replaced usedToken.
      if (this.state.refreshing) await this.state.refreshing
      else if (this.tokens?.accessToken === usedToken) await this.refresh()
      this.ensureCurrent(generation)
      if (!this.tokens) throw new Error('Sign in again.')
      const retryToken = this.tokens.accessToken
      response = await send()
      this.ensureCurrent(generation)
      if (response.status === 401) {
        if (this.state.refreshing) await this.state.refreshing
        this.ensureCurrent(generation)
        if (this.tokens?.accessToken === retryToken) this.clearSession()
      }
    }
    return response
  }
}
