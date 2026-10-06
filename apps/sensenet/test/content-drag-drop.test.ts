import { ActionModel, GenericContent } from '@sensenet/default-content-types'
import {
  canDropContents,
  contentDragAttributes,
  getContentDragRoots,
  isWithinContent,
} from '../src/components/content/content-drag-drop'

const content = (Id: number, Path: string, IsFolder = true): GenericContent =>
  ({ Id, Path, Name: Path.split('/').pop(), IsFolder } as GenericContent)
const withForbiddenAction = (item: GenericContent, Name: string): GenericContent => ({
  ...item,
  Actions: [{ Name, Forbidden: true } as ActionModel],
})
const documents = content(1, '/Root/Content/Documents')
const target = content(2, '/Root/Content/Archive')
const file = content(3, '/Root/Content/Documents/report.pdf', false)

describe('Explorer content drag and drop', () => {
  it('rejects both copy and move into the source itself or any descendant', () => {
    for (const operation of ['copy', 'move'] as const) {
      expect(canDropContents([documents], documents, operation)).toBe(false)
      expect(canDropContents([documents], content(4, '/Root/Content/Documents/2026'), operation)).toBe(false)
      expect(canDropContents([documents], content(4, '/root/content/DOCUMENTS/2026/'), operation)).toBe(false)
    }
  })

  it('compares complete path segments so sibling prefixes remain valid targets', () => {
    const sibling = content(4, '/Root/Content/Documents-Archive')
    expect(isWithinContent(sibling.Path, documents.Path)).toBe(false)
    expect(isWithinContent('/Root/Content/Documents2', documents.Path)).toBe(false)
    expect(canDropContents([documents], sibling, 'move')).toBe(true)
    expect(canDropContents([documents], sibling, 'copy')).toBe(true)
  })

  it('normalizes path case and trailing separators for ancestry checks', () => {
    expect(isWithinContent('/ROOT/Content/Documents/', '/root/content/')).toBe(true)
    expect(isWithinContent('/Root/Content/Documents/', '/root/content/documents')).toBe(true)
    expect(isWithinContent('/Root/Contents', '/Root/Content/')).toBe(false)
  })

  it('sends a selected folder once and excludes its selected descendants regardless of order', () => {
    const sibling = content(5, '/Root/Content/notes.txt', false)
    const nested = content(6, '/Root/Content/Documents/2026/report.pdf', false)
    expect(getContentDragRoots([file, sibling, documents, nested, documents, file])).toEqual([sibling, documents])
    expect(getContentDragRoots([documents, nested, file, documents, sibling])).toEqual([documents, sibling])
  })

  it('retains separate selected folders with similar names', () => {
    const sibling = content(5, '/Root/Content/Documents2')
    expect(getContentDragRoots([documents, sibling, file])).toEqual([documents, sibling])
  })

  it('allows copying into the existing parent but rejects a no-op move', () => {
    const parent = { ...documents, Path: '/root/content/DOCUMENTS/' }
    expect(canDropContents([file], parent, 'copy')).toBe(true)
    expect(canDropContents([file], parent, 'move')).toBe(false)
  })

  it('rejects the whole move when one selected item already belongs to the destination', () => {
    const existing = content(4, '/Root/Content/Archive/existing.pdf', false)
    expect(canDropContents([file, existing], target, 'move')).toBe(false)
    expect(canDropContents([file, existing], target, 'copy')).toBe(true)
  })

  it('rejects empty selections, invalid sources, the repository root and non-folder destinations', () => {
    expect(canDropContents([], target, 'move')).toBe(false)
    expect(canDropContents([content(0, '/Root/Content/Invalid')], target, 'copy')).toBe(false)
    expect(canDropContents([content(9, '')], target, 'copy')).toBe(false)
    expect(canDropContents([content(9, '/ROOT/')], target, 'copy')).toBe(false)
    expect(canDropContents([documents], file, 'move')).toBe(false)
    expect(canDropContents([documents], content(9, ''), 'move')).toBe(false)
  })

  it('honors operation-specific forbidden source actions across a multi-selection', () => {
    const copyForbidden = withForbiddenAction(file, 'CopyTo')
    const moveForbidden = withForbiddenAction(file, 'MoveTo')
    expect(canDropContents([copyForbidden], target, 'copy')).toBe(false)
    expect(canDropContents([copyForbidden], target, 'move')).toBe(true)
    expect(canDropContents([moveForbidden], target, 'move')).toBe(false)
    expect(canDropContents([moveForbidden], target, 'copy')).toBe(true)
    expect(canDropContents([documents, moveForbidden], target, 'move')).toBe(false)
  })

  it('rejects a destination with forbidden Add while ignoring unrelated forbidden actions', () => {
    const forbidden = withForbiddenAction(target, 'Add')
    expect(canDropContents([file], forbidden, 'copy')).toBe(false)
    expect(canDropContents([file], forbidden, 'move')).toBe(false)
    expect(canDropContents([withForbiddenAction(file, 'Delete')], withForbiddenAction(target, 'Delete'), 'move')).toBe(
      true,
    )
  })

  it('keeps deferred or empty action lists usable until the server checks permissions', () => {
    const deferred = { ...file, Actions: { __deferred: { uri: '/actions' } } } as GenericContent
    expect(canDropContents([deferred], { ...target, Actions: [] }, 'move')).toBe(true)
  })

  it('serializes target identity and permissions without making a target-only wrapper draggable', () => {
    const forbidden = withForbiddenAction(target, 'Add')
    const attributes = contentDragAttributes(forbidden, false)
    expect(attributes.draggable).toBe(false)
    expect(attributes['data-explorer-drag']).toBeUndefined()
    expect(JSON.parse(attributes['data-explorer-content'])).toMatchObject({
      Id: target.Id,
      Path: target.Path,
      IsFolder: true,
      Actions: [{ Name: 'Add', Forbidden: true }],
    })
  })
})
