import { normalizeRepositoryUrl } from './repository-session'

export type LocalEndpoints = { issuer: string; login: string; refresh: string; logout: string; revoke: string }
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
    for (const operation of ['login', 'refresh', 'logout', 'revoke'] as const) {
      if (data.local[operation] !== `/authentication/local/${operation}`)
        throw new Error('Invalid authentication endpoint.')
    }
  }
  return data
}

type Tokens = { accessToken: string; refreshToken: string; expiresIn: number }
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
  private tokens?: Tokens
  private refreshing?: Promise<void>
  private generation = 0
  readonly repositoryUrl: string
  readonly storageKey: string

  constructor(repoUrl: string, private endpoints: LocalEndpoints, private request: typeof fetch = fetch) {
    this.repositoryUrl = normalizeRepositoryUrl(repoUrl)
    if (new URL(this.repositoryUrl).protocol !== 'https:') throw new Error('Internal authentication requires HTTPS.')
    this.storageKey = localSessionKey(this.repositoryUrl, endpoints.issuer)
    try {
      const saved = sessionStorage.getItem(this.storageKey)
      if (saved) this.tokens = this.validateTokens(JSON.parse(saved), false)
    } catch {
      this.clear()
    }
  }

  onChange?: () => void
  get accessToken() {
    return this.tokens?.accessToken
  }
  get hasSession() {
    return !!this.tokens
  }
  get subject() {
    return this.tokens ? claims(this.tokens.accessToken).sub : undefined
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

  private save(tokens: Tokens, generation: number) {
    if (generation !== this.generation) throw new Error('Session has ended.')
    const validated = this.validateTokens(tokens)
    if (this.tokens && claims(validated.accessToken).sub !== this.subject)
      throw new Error('Internal authentication changed identity.')
    this.tokens = validated
    sessionStorage.setItem(this.storageKey, JSON.stringify(tokens))
    sessionStorage.setItem(
      localRepositoriesKey,
      JSON.stringify([...new Set([...getLocalRepositories(), this.repositoryUrl])]),
    )
    sessionStorage.setItem(localSelectedRepository, this.repositoryUrl)
    this.onChange?.()
    window.dispatchEvent(new Event(localSessionsChanged))
  }

  clear() {
    this.generation++
    this.tokens = undefined
    sessionStorage.removeItem(this.storageKey)
    sessionStorage.setItem(
      localRepositoriesKey,
      JSON.stringify(getLocalRepositories().filter((url) => url !== this.repositoryUrl)),
    )
    this.onChange?.()
    window.dispatchEvent(new Event(localSessionsChanged))
  }

  private async post(operation: 'login' | 'refresh' | 'logout', body: object) {
    // Only fixed repository-relative paths: discovery cannot redirect credentials to another issuer.
    if (this.endpoints[operation] !== `/authentication/local/${operation}`)
      throw new Error('Invalid authentication endpoint.')
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
    this.save(await response.json(), generation)
  }

  private async refresh() {
    if (this.refreshing) return this.refreshing
    const { generation } = this
    const refreshToken = this.tokens?.refreshToken
    if (!refreshToken) throw new Error('Sign in again.')
    const operation = (async () => {
      try {
        const response = await this.post('refresh', { refreshToken })
        this.save(await response.json(), generation)
      } catch {
        if (generation === this.generation) this.clear()
        throw new Error('Your internal session has ended. Sign in again.')
      }
    })()
    this.refreshing = operation
    try {
      await operation
    } finally {
      if (this.refreshing === operation) this.refreshing = undefined
    }
  }

  async logout() {
    const refreshToken = this.tokens?.refreshToken
    this.clear()
    if (refreshToken) await this.post('logout', { refreshToken })
  }

  /** Same-repository bearer transport with one refresh/retry after 401. */
  readonly fetch: typeof fetch = async (input, init) => {
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
      if (generation !== this.generation || !this.tokens) throw new Error('Your session has ended. Sign in again.')
      const headers = new Headers(original.headers)
      headers.set('Authorization', `Bearer ${this.tokens!.accessToken}`)
      return this.request(new Request(original.clone(), { headers, credentials: 'omit', redirect: 'error' }))
    }
    const usedToken = this.tokens?.accessToken
    let response = await send()
    if (response.status === 401) {
      if (generation !== this.generation) throw new Error('Your session has ended. Sign in again.')
      if (this.tokens?.accessToken === usedToken) await this.refresh()
      if (!this.tokens) throw new Error('Sign in again.')
      response = await send()
      if (response.status === 401 && generation === this.generation) this.clear()
    }
    return response
  }
}
