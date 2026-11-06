import { normalizeRepositoryUrl } from './repository-session'

export const repositoryConnectionsStorageKey = 'sn-repository-connections'
export const repositoryConnectionsChangedEvent = 'sn-repository-connections-changed'
const legacySnAuthRepositorySessionsKey = 'sn-auth-repository-sessions'

export type RepositoryConnection = {
  repoUrl: string
  name?: string
  pinned: boolean
  lastUsed?: string
}

// A denied/quota-limited storage write should not prevent repository selection.
// Keep changes for this page while still accepting newer persistent data.
let fallbackConnections: RepositoryConnection[] | undefined
let fallbackBase: string | null | undefined

export const parseRepositoryConnectionUrl = (input: string): string | undefined => {
  const value = input.trim()
  if (!value || /[\s\\]/.test(value) || value.startsWith('/')) return undefined

  const webUrl = /^https?:\/\//i.test(value)
  // Do not let URL's permissive slash handling turn a mistyped scheme into a
  // different repository host. A scheme-less host:port is still a valid input.
  if (/^https?:/i.test(value) && !webUrl) return undefined
  if (webUrl && !/^https?:\/\/[^/?#]/i.test(value)) return undefined
  if (/^[a-z][a-z0-9+.-]*:/i.test(value) && !webUrl && !/^[^/?#:\\]+:\d+(?:[/?#]|$)/.test(value)) return undefined

  try {
    const url = new URL(webUrl ? value : `https://${value}`)
    if (!['http:', 'https:'].includes(url.protocol) || !url.hostname || url.username || url.password) return undefined
    return normalizeRepositoryUrl(url.href)
  } catch {
    return undefined
  }
}

const sanitizeConnections = (records: unknown): RepositoryConnection[] => {
  if (!Array.isArray(records)) return []
  const connections = new Map<string, RepositoryConnection>()

  for (const record of records) {
    if (!record || typeof record.repoUrl !== 'string') continue
    const repoUrl = parseRepositoryConnectionUrl(record.repoUrl)
    if (!repoUrl) continue
    const name = typeof record.name === 'string' ? record.name.trim().slice(0, 80) || undefined : undefined
    const parsedDate = typeof record.lastUsed === 'string' ? Date.parse(record.lastUsed) : NaN
    const lastUsed = Number.isFinite(parsedDate) ? new Date(parsedDate).toISOString() : undefined
    const previous = connections.get(repoUrl)
    connections.set(repoUrl, {
      repoUrl,
      name: previous?.name || name,
      pinned: previous?.pinned || record.pinned === true,
      lastUsed: previous?.lastUsed && (!lastUsed || previous.lastUsed > lastUsed) ? previous.lastUsed : lastUsed,
    })
  }

  return [...connections.values()].sort((a, b) => (b.lastUsed || '').localeCompare(a.lastUsed || ''))
}

const readJson = (value: string | null): unknown => {
  try {
    return value === null ? undefined : JSON.parse(value)
  } catch {
    return undefined
  }
}

const saveConnections = (records: RepositoryConnection[], notify = true) => {
  const connections = sanitizeConnections(records)
  try {
    window.localStorage.setItem(repositoryConnectionsStorageKey, JSON.stringify({ version: 1, connections }))
    fallbackConnections = undefined
    fallbackBase = undefined
  } catch {
    fallbackConnections = connections
    try {
      fallbackBase = window.localStorage.getItem(repositoryConnectionsStorageKey)
    } catch {
      fallbackBase = undefined
    }
  }

  if (notify) window.dispatchEvent(new Event(repositoryConnectionsChangedEvent))
}

export const getRepositoryConnections = (): RepositoryConnection[] => {
  try {
    const raw = window.localStorage.getItem(repositoryConnectionsStorageKey)
    if (fallbackConnections && raw === fallbackBase) return fallbackConnections.map((connection) => ({ ...connection }))
    fallbackConnections = undefined
    fallbackBase = undefined

    if (raw === null) {
      // Import metadata once. Never copy credentials or modify the old session list.
      // Persist even an empty list so forgetting a connection cannot re-import it.
      const connections = sanitizeConnections(readJson(window.localStorage.getItem(legacySnAuthRepositorySessionsKey)))
      saveConnections(connections, false)
      return connections
    }

    const stored = readJson(raw) as { version?: unknown; connections?: unknown } | undefined
    return stored?.version === 1 ? sanitizeConnections(stored.connections) : []
  } catch {
    return fallbackConnections?.map((connection) => ({ ...connection })) || []
  }
}

export const rememberRepositoryConnection = (providedUrl: string): void => {
  const repoUrl = parseRepositoryConnectionUrl(providedUrl)
  if (!repoUrl) return
  const connections = getRepositoryConnections()
  const previous = connections.find((connection) => connection.repoUrl === repoUrl)
  saveConnections([
    { ...previous, repoUrl, pinned: previous?.pinned || false, lastUsed: new Date().toISOString() },
    ...connections.filter((connection) => connection.repoUrl !== repoUrl),
  ])
}

export const renameRepositoryConnection = (providedUrl: string, name: string): void => {
  const repoUrl = parseRepositoryConnectionUrl(providedUrl)
  if (!repoUrl) return
  saveConnections(
    getRepositoryConnections().map((connection) =>
      connection.repoUrl === repoUrl ? { ...connection, name: name.trim().slice(0, 80) || undefined } : connection,
    ),
  )
}

export const setRepositoryConnectionPinned = (providedUrl: string, pinned: boolean): void => {
  const repoUrl = parseRepositoryConnectionUrl(providedUrl)
  if (!repoUrl) return
  saveConnections(
    getRepositoryConnections().map((connection) =>
      connection.repoUrl === repoUrl ? { ...connection, pinned } : connection,
    ),
  )
}

export const removeRepositoryConnection = (providedUrl: string): RepositoryConnection | undefined => {
  const repoUrl = parseRepositoryConnectionUrl(providedUrl)
  if (!repoUrl) return undefined
  const connections = getRepositoryConnections()
  const removed = connections.find((connection) => connection.repoUrl === repoUrl)
  if (removed) saveConnections(connections.filter((connection) => connection.repoUrl !== repoUrl))
  return removed
}

export const restoreRepositoryConnection = (connection: RepositoryConnection): void => {
  const restored = sanitizeConnections([connection])[0]
  if (!restored) return
  const connections = getRepositoryConnections()
  if (!connections.some((existing) => existing.repoUrl === restored.repoUrl))
    saveConnections([...connections, restored])
}
