import {
  getRepositoryConnections,
  parseRepositoryConnectionUrl,
  rememberRepositoryConnection,
  removeRepositoryConnection,
  renameRepositoryConnection,
  repositoryConnectionsChangedEvent,
  repositoryConnectionsStorageKey,
  restoreRepositoryConnection,
  setRepositoryConnectionPinned,
} from '../src/services/repository-connections'

const first = 'https://first.example/repository'
const second = 'https://second.example'
const legacyKey = 'sn-auth-repository-sessions'
const older = '2026-10-01T09:00:00.000Z'
const newer = '2026-11-01T09:00:00.000Z'

describe('remembered repository connections', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
    localStorage.clear()
    // Discard a previous test's temporary fallback once storage is available.
    getRepositoryConnections()
    localStorage.clear()
  })

  afterEach(() => jest.restoreAllMocks())

  it('migrates legacy history once, deduplicates normalized URLs and copies only connection metadata', () => {
    const legacy = [
      {
        repoUrl: `${first}/?ignored#fragment`,
        lastUsed: older,
        authServerUrl: 'https://issuer.example',
        accessToken: 'secret',
      },
      { repoUrl: first, lastUsed: newer },
      { repoUrl: second, lastUsed: older },
    ]
    localStorage.setItem(legacyKey, JSON.stringify(legacy))
    expect(getRepositoryConnections()).toEqual([
      { repoUrl: first, pinned: false, lastUsed: newer },
      { repoUrl: second, pinned: false, lastUsed: older },
    ])
    expect(localStorage.getItem(legacyKey)).toBe(JSON.stringify(legacy))
    expect(localStorage.getItem(repositoryConnectionsStorageKey)).not.toContain('secret')
    expect(localStorage.getItem(repositoryConnectionsStorageKey)).not.toContain('issuer')

    removeRepositoryConnection(first)
    localStorage.setItem(legacyKey, JSON.stringify([{ repoUrl: first, lastUsed: new Date().toISOString() }]))
    expect(getRepositoryConnections().map((connection) => connection.repoUrl)).toEqual([second])
  })

  it('saves an empty migration marker and never imports later authentication records', () => {
    expect(getRepositoryConnections()).toEqual([])
    localStorage.setItem(legacyKey, JSON.stringify([{ repoUrl: first, lastUsed: newer }]))
    expect(getRepositoryConnections()).toEqual([])
    expect(JSON.parse(localStorage.getItem(repositoryConnectionsStorageKey)!)).toEqual({ version: 1, connections: [] })
  })

  it('keeps aliases and pins while recording explicit successful usage, without changing dates on metadata edits', () => {
    const now = jest.spyOn(Date.prototype, 'toISOString').mockReturnValue(newer)
    rememberRepositoryConnection(first)
    renameRepositoryConnection(first, '  Documents  ')
    setRepositoryConnectionPinned(first, true)
    expect(getRepositoryConnections()).toEqual([{ repoUrl: first, name: 'Documents', pinned: true, lastUsed: newer }])
    now.mockRestore()

    rememberRepositoryConnection(`${first}/?ignored=true`)
    const [connection] = getRepositoryConnections()
    expect(connection.name).toBe('Documents')
    expect(connection.pinned).toBe(true)
    expect(connection.lastUsed).not.toBe(newer)
    expect(getRepositoryConnections()).toHaveLength(1)

    renameRepositoryConnection(first, 'x'.repeat(100))
    expect(getRepositoryConnections()[0].name).toHaveLength(80)
    renameRepositoryConnection(first, '   ')
    expect(getRepositoryConnections()[0].name).toBeUndefined()
  })

  it('removes metadata without changing tokens, session history, selected repository or authentication configuration', () => {
    const authRecords = {
      'sn-auth-access-token': 'access',
      'sn-auth-refresh-token': 'refresh',
      'sn-auth-selected-repository': first,
      'sn-auth-config': 'global config',
      [`sn-auth-config:${encodeURIComponent(first)}`]: 'repository config',
      [legacyKey]: JSON.stringify([{ repoUrl: first, lastUsed: newer }]),
    }
    Object.entries(authRecords).forEach(([key, value]) => localStorage.setItem(key, value))
    renameRepositoryConnection(first, 'Saved name')
    setRepositoryConnectionPinned(first, true)
    const removed = removeRepositoryConnection(first)
    expect(getRepositoryConnections()).toEqual([])
    Object.entries(authRecords).forEach(([key, value]) => expect(localStorage.getItem(key)).toBe(value))

    restoreRepositoryConnection(removed!)
    expect(getRepositoryConnections()).toEqual([{ repoUrl: first, name: 'Saved name', pinned: true, lastUsed: newer }])
  })

  it('does not let Undo overwrite a connection re-added or edited after removal', () => {
    rememberRepositoryConnection(first)
    renameRepositoryConnection(first, 'Old name')
    const removed = removeRepositoryConnection(first)!
    rememberRepositoryConnection(first)
    renameRepositoryConnection(first, 'New name')
    restoreRepositoryConnection(removed)
    expect(getRepositoryConnections()).toHaveLength(1)
    expect(getRepositoryConnections()[0].name).toBe('New name')
  })

  it('sanitizes malformed records, dates and duplicates without trusting stored extra fields', () => {
    localStorage.setItem(
      repositoryConnectionsStorageKey,
      JSON.stringify({
        version: 1,
        connections: [
          null,
          {},
          { repoUrl: 42 },
          { repoUrl: 'ftp://files.example' },
          { repoUrl: `${first}/`, name: '  Preferred  ', pinned: true, lastUsed: older, token: 'secret' },
          { repoUrl: first, pinned: false, lastUsed: newer },
          { repoUrl: second, pinned: 'true', name: 42, lastUsed: 'not a date' },
        ],
      }),
    )
    expect(getRepositoryConnections()).toEqual([
      { repoUrl: first, name: 'Preferred', pinned: true, lastUsed: newer },
      { repoUrl: second, pinned: false, lastUsed: undefined },
    ])
  })

  it.each(['{invalid', 'null', '[]', '{"version":2,"connections":[]}', '{"version":1,"connections":{}}'])(
    'handles corrupt or unsupported saved data without resurrecting old sessions: %s',
    (raw) => {
      localStorage.setItem(repositoryConnectionsStorageKey, raw)
      localStorage.setItem(legacyKey, JSON.stringify([{ repoUrl: first, lastUsed: newer }]))
      expect(getRepositoryConnections()).toEqual([])
    },
  )

  it('notifies subscribers after same-tab mutations, but not while reading or migrating', () => {
    const listener = jest.fn()
    window.addEventListener(repositoryConnectionsChangedEvent, listener)
    try {
      getRepositoryConnections()
      expect(listener).not.toHaveBeenCalled()
      rememberRepositoryConnection(first)
      renameRepositoryConnection(first, 'Name')
      setRepositoryConnectionPinned(first, true)
      const removed = removeRepositoryConnection(first)!
      restoreRepositoryConnection(removed)
      expect(listener).toHaveBeenCalledTimes(5)
    } finally {
      window.removeEventListener(repositoryConnectionsChangedEvent, listener)
    }
  })

  it('keeps usable in-page metadata when writes fail and adopts newer data from another tab', () => {
    getRepositoryConnections()
    const stored = localStorage.getItem(repositoryConnectionsStorageKey)
    const setItem = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Full', 'QuotaExceededError')
    })
    expect(() => rememberRepositoryConnection(first)).not.toThrow()
    renameRepositoryConnection(first, 'Temporary')
    setRepositoryConnectionPinned(first, true)
    expect(getRepositoryConnections()[0]).toMatchObject({ repoUrl: first, name: 'Temporary', pinned: true })
    expect(localStorage.getItem(repositoryConnectionsStorageKey)).toBe(stored)
    setItem.mockRestore()
    localStorage.setItem(
      repositoryConnectionsStorageKey,
      JSON.stringify({ version: 1, connections: [{ repoUrl: second, pinned: false }] }),
    )
    expect(getRepositoryConnections()).toEqual([{ repoUrl: second, pinned: false, lastUsed: undefined }])
  })

  it('does not break selection when localStorage access is denied', () => {
    const read = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('Denied', 'SecurityError')
    })
    const write = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Denied', 'SecurityError')
    })
    expect(getRepositoryConnections()).toEqual([])
    expect(() => rememberRepositoryConnection(first)).not.toThrow()
    expect(getRepositoryConnections()[0].repoUrl).toBe(first)
    read.mockRestore()
    write.mockRestore()
  })

  it('does not remember a different host when an explicit URL has a mistyped scheme', () => {
    rememberRepositoryConnection('https:/repository.example')
    rememberRepositoryConnection('http:/repository.example')
    expect(getRepositoryConnections()).toEqual([])
  })
})

describe('repository connection URL validation', () => {
  it.each([
    ['  first.example/repository/  ', first],
    [`${first}///?query=ignored#fragment`, first],
    ['localhost:8080', 'https://localhost:8080'],
    ['repo:8080/path', 'https://repo:8080/path'],
    ['repo.example:8443/tenant/', 'https://repo.example:8443/tenant'],
    ['[2001:db8::1]:8443/tenant/', 'https://[2001:db8::1]:8443/tenant'],
    ['http://[::1]:8080/repository/', 'http://[::1]:8080/repository'],
    ['http://localhost:8080/', 'http://localhost:8080'],
    ['https://FIRST.example:443/repository', first],
  ])('normalizes %s', (input, expected) => expect(parseRepositoryConnectionUrl(input)).toBe(expected))

  it.each([
    '',
    '   ',
    '/relative/path',
    '//first.example',
    'ftp://first.example',
    // eslint-disable-next-line no-script-url
    'javascript:alert(1)',
    'https://',
    'https:/repo.example',
    'http:/repo.example',
    'HTTPS:/repo.example',
    'https:repo.example',
    'https:8080',
    'https:///repo.example',
    'https:////repo.example',
    'ftp:/repo.example',
    'https:\\repo.example',
    'https:\\\\repo.example',
    'https://repo.example\\path',
    'repo.example\\path',
    'https://user:secret@first.example',
    'https://first .example',
    'https://first.example/a b',
  ])('rejects %s', (input) => expect(parseRepositoryConnectionUrl(input)).toBeUndefined())
})
