import { ActionModel, GenericContent } from '@sensenet/default-content-types'
import { addFullscreenEditAction, supportsFullscreenEdit } from '../src/services/fullscreen-edit-service'

const file = (Name: string, overrides: Partial<GenericContent> = {}) =>
  ({
    Id: 42,
    Name,
    Path: `/Root/Content/Documents/${Name}`,
    Type: 'File',
    IsFile: true,
    IsFolder: false,
    ...overrides,
  } as GenericContent)
const action = (Name: string, Forbidden = false) => ({ Name, Forbidden } as ActionModel)

describe('Full-screen editing of text files', () => {
  it.each([
    'data.csv',
    'notes.txt',
    'data.json',
    'index.html',
    'style.css',
    'config.xml',
    'config.yaml',
    'config.toml',
    'readme.md',
    'app.js',
    'app.tsx',
    'style.scss',
    'app.log',
    'config.ini',
    '.env',
    'query.sql',
    'script.ps1',
    'script.sh',
    'app.py',
    'image.svg',
    'contacts.vcf',
    'DATA.CSV',
    'Data.JsOn',
  ])('offers full-screen editing for %s outside the system roots', (name) => {
    expect(supportsFullscreenEdit(file(name))).toBe(true)
    expect(addFullscreenEditAction(file(name), [action('Browse'), action('Edit')]).map(({ Name }) => Name)).toEqual([
      'Browse',
      'Edit',
      'EditBinary',
    ])
  })

  it.each([
    'document.pdf',
    'document.docx',
    'table.xlsx',
    'image.png',
    'archive.zip',
    'data.txt.gz',
    'README',
    'txt',
    'file.',
  ])('does not expose even a server-provided full-screen action for %s', (name) => {
    const content = file(name)
    const actions = [action('Browse'), action('EditBinary'), action('Edit')]
    expect(supportsFullscreenEdit(content)).toBe(false)
    expect(addFullscreenEditAction(content, actions).map(({ Name }) => Name)).toEqual(['Browse', 'Edit'])
    expect(actions).toHaveLength(3)
  })

  it('uses the actual filename or final path segment, never the display name or a dotted parent folder', () => {
    expect(supportsFullscreenEdit(file('document.pdf', { DisplayName: 'notes.txt' }))).toBe(false)
    expect(supportsFullscreenEdit(file('document.txt', { DisplayName: 'document.pdf' }))).toBe(true)
    expect(supportsFullscreenEdit(file('', { Path: '/Root/Content/notes.TXT' }))).toBe(true)
    expect(supportsFullscreenEdit(file('', { Path: '/Root/Content/folder.txt/README' }))).toBe(false)
    expect(supportsFullscreenEdit(file('notes.txt', { Path: undefined }))).toBe(false)
  })

  it('supports file subtypes and File metadata without the IsFile projection', () => {
    expect(supportsFullscreenEdit(file('notes.txt', { Type: 'CustomFile' }))).toBe(true)
    expect(supportsFullscreenEdit(file('notes.txt', { IsFile: undefined }))).toBe(true)
    expect(supportsFullscreenEdit(file('notes.txt', { Type: 'Memo', IsFile: false }))).toBe(false)
  })

  it('excludes folders even if their names have text extensions', () => {
    expect(supportsFullscreenEdit(file('folder.txt', { IsFolder: true }))).toBe(false)
    expect(supportsFullscreenEdit(file('folder.json', { Type: 'SystemFolder' }))).toBe(false)
  })

  it.each(['Edit', 'EditBinary'])('honors a forbidden %s action when building the visible menu', (name) => {
    const content = file('notes.txt', { Actions: [action('Browse'), action(name, true)] })
    expect(supportsFullscreenEdit(content)).toBe(false)
    expect(addFullscreenEditAction(content, [action('Browse'), action('EditBinary')])).toEqual([action('Browse')])
  })

  it('adds a localized action once when no metadata Edit action is present', () => {
    const content = file('notes.txt')
    const actions = [action('Browse')]
    const result = addFullscreenEditAction(content, actions, 'Teljes képernyős szerkesztés')
    expect(result.map(({ Name }) => Name)).toEqual(['Browse', 'EditBinary'])
    expect(result[1].DisplayName).toBe('Teljes képernyős szerkesztés')
    expect(addFullscreenEditAction(content, result)).toBe(result)
    expect(actions).toHaveLength(1)
  })

  it('also enforces the extension list for regular files under the system roots', () => {
    for (const root of ['/Root/System/Settings', '/Root/Localization', '/Root/System/Schema/ContentTypes']) {
      expect(supportsFullscreenEdit(file('document.pdf', { Path: `${root}/document.pdf` }))).toBe(false)
      expect(supportsFullscreenEdit(file('notes.txt', { Path: `${root}/notes.txt` }))).toBe(true)
    }
  })
})
