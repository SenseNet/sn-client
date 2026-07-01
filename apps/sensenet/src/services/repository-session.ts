import { PathHelper } from '@sensenet/client-utils'
import { ACCESS_TOKEN_KEY, getStorageKey, REFRESH_TOKEN_KEY } from '@sensenet/sn-auth-react'

export const oidcAuthConfigKey = 'sn-oidc-config'
export const snAuthConfigKey = 'sn-auth-config'

const snAuthSelectedRepositoryKey = 'sn-auth-selected-repository'
const snAuthRepositorySessionsKey = 'sn-auth-repository-sessions'
const snAuthPendingLoginRepositoryKey = 'sn-auth-pending-login-repository'
const snAuthScopedConfigKeyPrefix = 'sn-auth-config'
const snAuthStorageKeyPrefix = 'sn-auth'

export const snAuthRepositorySessionsChangedEvent = 'sn-auth-repository-sessions-changed'

export type SnAuthRepositorySession = {
  repoUrl: string
  authServerUrl?: string
  lastUsed: string
}

export const normalizeRepositoryUrl = (repoUrl: string) => {
  const ensuredUrl = PathHelper.ensureDefaultSchema(repoUrl.trim())

  try {
    const url = new URL(ensuredUrl)
    url.hash = ''
    url.search = ''
    url.pathname = url.pathname.replace(/\/+$/, '')

    return url.toString().replace(/\/$/, '')
  } catch {
    return ensuredUrl.replace(/\/+$/, '')
  }
}

const encodeRepositoryUrl = (repoUrl: string) => encodeURIComponent(normalizeRepositoryUrl(repoUrl))

export const getSnAuthStorageKeyPrefix = (repoUrl: string) =>
  `${snAuthStorageKeyPrefix}:${encodeRepositoryUrl(repoUrl)}`

export const getSnAuthRepositoryConfigKey = (repoUrl: string) =>
  `${snAuthScopedConfigKeyPrefix}:${encodeRepositoryUrl(repoUrl)}`

export const hasSnAuthRepositoryTokens = (repoUrl: string) => {
  const storageKeyPrefix = getSnAuthStorageKeyPrefix(repoUrl)

  return (
    !!window.localStorage.getItem(getStorageKey(ACCESS_TOKEN_KEY, storageKeyPrefix)) &&
    !!window.localStorage.getItem(getStorageKey(REFRESH_TOKEN_KEY, storageKeyPrefix))
  )
}

export const getSelectedSnAuthRepository = () => window.localStorage.getItem(snAuthSelectedRepositoryKey)

export const setSelectedSnAuthRepository = (repoUrl: string) => {
  window.localStorage.setItem(snAuthSelectedRepositoryKey, normalizeRepositoryUrl(repoUrl))
}

export const clearSelectedSnAuthRepository = () => {
  window.localStorage.removeItem(snAuthSelectedRepositoryKey)
}

export const startSnAuthRepositoryLogin = (repoUrl: string) => {
  window.localStorage.setItem(snAuthPendingLoginRepositoryKey, normalizeRepositoryUrl(repoUrl))
}

export const hasPendingSnAuthRepositoryLogin = (repoUrl: string) =>
  window.localStorage.getItem(snAuthPendingLoginRepositoryKey) === normalizeRepositoryUrl(repoUrl)

export const consumeSnAuthRepositoryLogin = (repoUrl: string) => {
  if (hasPendingSnAuthRepositoryLogin(repoUrl)) {
    window.localStorage.removeItem(snAuthPendingLoginRepositoryKey)
    return true
  }

  return false
}

export const clearPendingSnAuthRepositoryLogin = () => {
  window.localStorage.removeItem(snAuthPendingLoginRepositoryKey)
}

export const getSnAuthRepositorySessions = (): SnAuthRepositorySession[] => {
  try {
    const sessions = JSON.parse(window.localStorage.getItem(snAuthRepositorySessionsKey) ?? '[]')

    return Array.isArray(sessions)
      ? sessions
          .filter((session): session is SnAuthRepositorySession => !!session?.repoUrl)
          .sort((a, b) => b.lastUsed.localeCompare(a.lastUsed))
      : []
  } catch {
    return []
  }
}

export const getAuthenticatedSnAuthRepositorySessions = () =>
  getSnAuthRepositorySessions().filter((session) => hasSnAuthRepositoryTokens(session.repoUrl))

export const upsertSnAuthRepositorySession = (repoUrl: string, authServerUrl?: string) => {
  const normalizedRepoUrl = normalizeRepositoryUrl(repoUrl)
  const sessions = getSnAuthRepositorySessions().filter((session) => session.repoUrl !== normalizedRepoUrl)
  const nextSessions = [
    {
      repoUrl: normalizedRepoUrl,
      authServerUrl,
      lastUsed: new Date().toISOString(),
    },
    ...sessions,
  ]

  window.localStorage.setItem(snAuthRepositorySessionsKey, JSON.stringify(nextSessions))
  setSelectedSnAuthRepository(normalizedRepoUrl)
  window.dispatchEvent(new Event(snAuthRepositorySessionsChangedEvent))
}

export const removeSnAuthRepositorySession = (repoUrl: string) => {
  const normalizedRepoUrl = normalizeRepositoryUrl(repoUrl)
  const storageKeyPrefix = getSnAuthStorageKeyPrefix(normalizedRepoUrl)
  const sessions = getSnAuthRepositorySessions().filter((session) => session.repoUrl !== normalizedRepoUrl)

  window.localStorage.setItem(snAuthRepositorySessionsKey, JSON.stringify(sessions))
  window.localStorage.removeItem(getSnAuthRepositoryConfigKey(normalizedRepoUrl))
  window.localStorage.removeItem(getStorageKey(ACCESS_TOKEN_KEY, storageKeyPrefix))
  window.localStorage.removeItem(getStorageKey(REFRESH_TOKEN_KEY, storageKeyPrefix))

  if (getSelectedSnAuthRepository() === normalizedRepoUrl) {
    clearSelectedSnAuthRepository()
  }

  window.dispatchEvent(new Event(snAuthRepositorySessionsChangedEvent))
}

export const getSnAuthRepositoryConfig = (repoUrl: string) => {
  const configString = window.localStorage.getItem(getSnAuthRepositoryConfigKey(repoUrl))

  return configString ? JSON.parse(configString) : null
}

export const setSnAuthRepositoryConfig = (repoUrl: string, config: unknown) => {
  const configString = JSON.stringify(config)

  window.localStorage.setItem(getSnAuthRepositoryConfigKey(repoUrl), configString)
  window.localStorage.setItem(snAuthConfigKey, configString)
}

export const migrateLegacySnAuthTokens = (repoUrl: string) => {
  const storageKeyPrefix = getSnAuthStorageKeyPrefix(repoUrl)
  const legacyAccessToken = window.localStorage.getItem(ACCESS_TOKEN_KEY)
  const legacyRefreshToken = window.localStorage.getItem(REFRESH_TOKEN_KEY)
  const scopedAccessTokenKey = getStorageKey(ACCESS_TOKEN_KEY, storageKeyPrefix)
  const scopedRefreshTokenKey = getStorageKey(REFRESH_TOKEN_KEY, storageKeyPrefix)

  if (legacyAccessToken && !window.localStorage.getItem(scopedAccessTokenKey)) {
    window.localStorage.setItem(scopedAccessTokenKey, legacyAccessToken)
  }

  if (legacyRefreshToken && !window.localStorage.getItem(scopedRefreshTokenKey)) {
    window.localStorage.setItem(scopedRefreshTokenKey, legacyRefreshToken)
  }

  window.localStorage.removeItem(ACCESS_TOKEN_KEY)
  window.localStorage.removeItem(REFRESH_TOKEN_KEY)
}

export const clearActiveRepositorySelection = () => {
  window.localStorage.removeItem(oidcAuthConfigKey)
  window.localStorage.removeItem(snAuthConfigKey)
  clearSelectedSnAuthRepository()
  clearPendingSnAuthRepositoryLogin()
}
