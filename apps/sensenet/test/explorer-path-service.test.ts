import { Repository } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import {
  findExplorerPath,
  getExplorerPathCompletion,
  loadExplorerPathSuggestions,
  normalizeExplorerPath,
} from '../src/services/explorer-path-service'

describe('Explorer address path normalization', () => {
  it.each([
    ['/Root/Content/Documents', '/Root/Elsewhere', '/Root/Content/Documents'],
    ['root/Content', '/Root/Elsewhere', '/Root/Content'],
    ['/Content/Documents', '/Root/Elsewhere', '/Root/Content/Documents'],
    ['Documents', '/Root/Content', '/Root/Content/Documents'],
    ['./Documents', '/Root/Content', '/Root/Content/Documents'],
    ['../Images', '/Root/Content/Documents', '/Root/Content/Images'],
    ['../../../../Images', '/Root/Content', '/Root/Images'],
    ['/Root/Content/../Images/./', '/Root/Elsewhere', '/Root/Images'],
    [' /Root//Content///Documents/ ', '/Root/Elsewhere', '/Root/Content/Documents'],
    ['/', '/Root/Content', '/Root'],
    ['', '/Root/Content', '/Root/Content'],
    ['100%%2F%ZZ.txt', '/Root/Content', '/Root/Content/100%%2F%ZZ.txt'],
    ['/Root/Content/a#b?c.txt', '/Root', '/Root/Content/a#b?c.txt'],
  ])('normalizes %j relative to %j as %j', (value, currentFolder, expected) => {
    expect(normalizeExplorerPath(value, currentFolder)).toBe(expected)
  })

  it.each([
    'https://external.example/path',
    'HTTP://external.example',
    // eslint-disable-next-line no-script-url -- This is deliberately rejected address input.
    'javascript:alert(1)',
    'file:///Root',
    '/Root/Con\ntent',
    '/Root/Con\u0000tent',
  ])('rejects non-repository input %j', (value) => {
    expect(normalizeExplorerPath(value, '/Root/Content')).toBeUndefined()
  })
})

describe('Explorer path completion queries', () => {
  it('queries only immediate children of the typed parent with a name prefix', () => {
    expect(getExplorerPathCompletion('/Root/Content/Doc', '/Root')).toEqual({
      folder: '/Root/Content',
      prefix: 'Doc',
      query: '+InFolder:"/Root/Content" +Name:"Doc*"',
    })
  })

  it('lists a completed folder, root, or current folder without a wildcard name query', () => {
    expect(getExplorerPathCompletion('/Root/Content/', '/Root')).toEqual({
      folder: '/Root/Content',
      prefix: '',
      query: '+InFolder:"/Root/Content"',
    })
    expect(getExplorerPathCompletion('/Root', '/Root/Content')?.query).toBe('+InFolder:"/Root"')
    expect(getExplorerPathCompletion('', '/Root/Content')?.query).toBe('+InFolder:"/Root/Content"')
  })

  it('resolves relative parent segments before constructing the bounded folder query', () => {
    expect(getExplorerPathCompletion('../Images/Photo', '/Root/Content/Documents')).toEqual({
      folder: '/Root/Content/Images',
      prefix: 'Photo',
      query: '+InFolder:"/Root/Content/Images" +Name:"Photo*"',
    })
  })

  it('escapes quote, backslash and wildcard characters in both folder and prefix', () => {
    expect(getExplorerPathCompletion('/Root/A"\\*?/a"\\*?', '/Root')?.query).toBe(
      String.raw`+InFolder:"/Root/A\"\\\*\?" +Name:"a\"\\\*\?*"`,
    )
  })

  it('keeps percent escapes and hash characters literal in completion prefixes', () => {
    expect(getExplorerPathCompletion('100%%2F#name', '/Root/Content')?.query).toBe(
      '+InFolder:"/Root/Content" +Name:"100%%2F#name*"',
    )
  })
})

describe('Explorer path repository reads', () => {
  const { signal } = new AbortController()
  const folder = { Id: 11, Path: '/Root/Content/Documents', Name: 'Documents', IsFolder: true } as GenericContent
  let loadCollection: jest.Mock
  let repository: Repository

  beforeEach(() => {
    loadCollection = jest.fn().mockResolvedValue({ d: { results: [folder] } })
    repository = { loadCollection } as unknown as Repository
  })

  it('requests at most twenty immediate children with cancellation and just the required fields', async () => {
    await expect(loadExplorerPathSuggestions(repository, '/Root/Content/Doc', '/Root', signal)).resolves.toEqual([
      folder,
    ])
    expect(loadCollection).toHaveBeenCalledTimes(1)
    expect(loadCollection).toHaveBeenCalledWith({
      path: '/Root',
      requestInit: { signal },
      oDataOptions: {
        query: '+InFolder:"/Root/Content" +Name:"Doc*"',
        select: ['Id', 'Path', 'Name', 'DisplayName', 'Type', 'Icon', 'IsFolder', 'IsFile'],
        onlyselectList: true,
        top: 20,
        inlinecount: 'none',
        metadata: 'no',
        orderby: [
          ['IsFolder', 'desc'],
          ['Name', 'asc'],
        ],
        enableautofilters: false,
        enablelifespanfilter: false,
      },
    })
  })

  it('respects the hidden-item preference without changing the immediate-folder scope', async () => {
    await loadExplorerPathSuggestions(repository, '/Root/Content/', '/Root', signal, false)
    expect(loadCollection.mock.calls[0][0].oDataOptions).toMatchObject({
      query: '+InFolder:"/Root/Content"',
      enableautofilters: true,
      top: 20,
    })
  })

  it('does not issue a repository read for rejected address input', async () => {
    await expect(loadExplorerPathSuggestions(repository, 'https://external.example', '/Root', signal)).resolves.toEqual(
      [],
    )
    expect(loadCollection).not.toHaveBeenCalled()
  })

  it('resolves an exact path case-insensitively, rather than accepting a prefix result', async () => {
    loadCollection.mockResolvedValue({ d: { results: [{ ...folder, Path: '/Root/Content/Documents-old' }, folder] } })
    await expect(findExplorerPath(repository, '/root/content/documents', signal)).resolves.toBe(folder)
    expect(loadCollection.mock.calls[0][0]).toMatchObject({
      path: '/Root',
      oDataOptions: {
        query: '+Path:"/root/content/documents"',
        top: 1,
        enableautofilters: false,
        enablelifespanfilter: false,
      },
    })
    expect(loadCollection.mock.calls[0][0].requestInit.signal).toBe(signal)
  })

  it('does not navigate to a different path when the backend returns a non-exact result', async () => {
    loadCollection.mockResolvedValue({ d: { results: [{ ...folder, Path: '/Root/Content/Documents-old' }] } })
    await expect(findExplorerPath(repository, folder.Path, signal)).resolves.toBeUndefined()
  })

  it('escapes exact Path query syntax while preserving the requested filename', async () => {
    const path = '/Root/A"\\*?/file%2F#100%'
    const exact = { ...folder, Path: path }
    loadCollection.mockResolvedValue({ d: { results: [exact] } })
    await expect(findExplorerPath(repository, path, signal)).resolves.toBe(exact)
    expect(loadCollection.mock.calls[0][0].oDataOptions.query).toBe(String.raw`+Path:"/Root/A\"\\\*\?/file%2F#100%"`)
  })

  it('passes network failures back to the caller for visible address error handling', async () => {
    const failure = new TypeError('Failed to fetch')
    loadCollection.mockRejectedValue(failure)
    await expect(loadExplorerPathSuggestions(repository, '/Root/Content/', '/Root', signal)).rejects.toBe(failure)
    await expect(findExplorerPath(repository, folder.Path, signal)).rejects.toBe(failure)
  })
})
