import { Repository } from '@sensenet/client-core'
import {
  getLocalColumnSettingsPath,
  loadColumnSettings,
  resolveColumnSettingsSource,
} from '../src/services/column-settings-service'
import { loadRepositorySettings } from '../src/services/repository-settings-service'

const missing = { statusCode: 404 }
const createRepository = (body = '{}', status = 200) => {
  const error = { statusCode: status, message: 'Request failed' }
  const repository = {
    configuration: { repositoryUrl: 'https://repo.example.test', oDataToken: 'OData.svc' },
    fetch: jest.fn().mockResolvedValue({ ok: status >= 200 && status < 300, status, text: async () => body }),
    load: jest.fn().mockRejectedValue(missing),
    getErrorFromResponse: jest.fn().mockResolvedValue(error),
  }
  return { repository: repository as unknown as Repository, fetch: repository.fetch, load: repository.load, error }
}

describe('Optional repository settings', () => {
  it.each([
    [200, ''],
    [200, '  '],
    [200, '{}'],
    [200, '"{}"'],
    [200, 'null'],
    [204, ''],
    [404, 'not found'],
  ])('uses default columns for status %s and absent settings %s', async (status, body) => {
    const { repository } = createRepository(body as string, status as number)
    await expect(loadColumnSettings(repository, '/Root/Content/Bicycles/BT00')).resolves.toBeUndefined()
  })

  it('loads inherited columns from GetSettings with authentication and cancellation', async () => {
    const columns = [{ field: 'DisplayName', title: 'Name' }, { field: 'ModificationDate' }]
    const { repository, fetch } = createRepository(JSON.stringify({ columns }))
    const controller = new AbortController()
    await expect(loadColumnSettings(repository, '/Root/Content/Bicycles/BT00', controller.signal)).resolves.toEqual({
      columns,
    })
    expect(fetch).toHaveBeenCalledWith(
      "https://repo.example.test/OData.svc/Root/Content/Bicycles/('BT00')/GetSettings?name=ColumnSettings",
      { method: 'GET', credentials: 'include', signal: controller.signal },
    )
  })

  it.each([401, 403, 500])('preserves actual HTTP %s errors', async (status) => {
    const { repository, error } = createRepository('', status)
    await expect(loadColumnSettings(repository, 42)).rejects.toBe(error)
  })

  it('does not confuse malformed settings with missing settings', async () => {
    const { repository } = createRepository('<html>Gateway error</html>')
    await expect(loadColumnSettings(repository, 42)).rejects.toBeInstanceOf(SyntaxError)
  })

  it('preserves network failures and aborts for the calling lifecycle to handle', async () => {
    const { repository, fetch } = createRepository()
    const failure = new TypeError('Failed to fetch')
    fetch.mockRejectedValueOnce(failure)
    await expect(loadColumnSettings(repository, 42)).rejects.toBe(failure)
    const abort = new DOMException('Aborted', 'AbortError')
    fetch.mockRejectedValueOnce(abort)
    await expect(loadColumnSettings(repository, 42)).rejects.toBe(abort)
  })

  it('loads portal settings over OData without fetching the raw settings binary', async () => {
    const { repository, fetch, load } = createRepository('{"HeaderColor":"#cc5500"}')
    await expect(loadRepositorySettings(repository, '/Root', 'Portal')).resolves.toEqual({ HeaderColor: '#cc5500' })
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch.mock.calls[0][0]).toBe("https://repo.example.test/OData.svc/('Root')/GetSettings?name=Portal")
    expect(load).not.toHaveBeenCalled()
  })
})

describe('Column settings source lookup', () => {
  it('finds global settings after missing local overrides and uses the server root location', async () => {
    const { repository, load } = createRepository()
    const globalPath = '/Root/System/Settings/ColumnSettings.settings'
    load.mockImplementation(async ({ idOrPath }) => {
      if (idOrPath === globalPath) return { d: { Path: globalPath } }
      throw missing
    })
    await expect(resolveColumnSettingsSource(repository, '/Root/Content/Bicycles')).resolves.toMatchObject({
      kind: 'inherited',
      effectiveSettingsPath: globalPath,
      effectiveSettingsOwnerPath: '/Root',
      localSettingsPath: '/Root/Content/Bicycles/Settings/ColumnSettings.settings',
    })
    expect(getLocalColumnSettingsPath('/Root')).toBe(globalPath)
    expect(load.mock.calls.map(([args]) => args.idOrPath)).not.toContain('/Root/Settings/ColumnSettings.settings')
  })

  it('stops looking up ancestors once the nearest source is found', async () => {
    const { repository, load } = createRepository()
    const localPath = '/Root/Content/Settings/ColumnSettings.settings'
    load.mockResolvedValue({ d: { Path: localPath } })
    await expect(resolveColumnSettingsSource(repository, '/Root/Content')).resolves.toMatchObject({ kind: 'local' })
    expect(load).toHaveBeenCalledTimes(1)
  })

  it('returns none when all optional settings are absent', async () => {
    const { repository } = createRepository()
    await expect(resolveColumnSettingsSource(repository, '/Root/Content')).resolves.toMatchObject({ kind: 'none' })
  })

  it('propagates network errors instead of reporting a false missing source', async () => {
    const { repository, load } = createRepository()
    const error = new TypeError('Failed to fetch')
    load.mockRejectedValue(error)
    await expect(resolveColumnSettingsSource(repository, '/Root/Content')).rejects.toBe(error)
    expect(load).toHaveBeenCalledTimes(1)
  })
})
