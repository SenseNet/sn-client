import { getTreeModeAction, getTreeModeTargetPath, isTreeEditAction } from '../src/components/tree/tree-mode-navigation'

const parent = { rootPath: '/Root', currentPath: '/Root/Content', search: '?path=%2FContent' }

describe('Explorer tree View/Edit navigation', () => {
  it('targets the opened folder rather than a selected child while displaying the grid', () => {
    expect(getTreeModeTargetPath({ ...parent, search: '?path=%2FContent&content=%2FContent%2FSelected' })).toBe(
      '/Root/Content',
    )
  })

  it('targets the action content rather than the parent folder behind its editor', () => {
    for (const action of ['edit', 'browse', 'edit-binary', 'wopi-edit', 'wopi-view', 'image']) {
      expect(
        getTreeModeTargetPath({ ...parent, action, search: '?path=%2FContent&content=%2FContent%2FDocument.txt' }),
      ).toBe('/Root/Content/Document.txt')
    }
  })

  it('respects absolute edit content and custom route roots', () => {
    expect(
      getTreeModeTargetPath({ ...parent, action: 'edit', search: '?content=%2FRoot%2FElsewhere&needRoot=false' }),
    ).toBe('/Root/Elsewhere')
    expect(
      getTreeModeTargetPath({
        ...parent,
        rootPath: '/Root/Content/Custom',
        action: 'browse',
        search: '?content=%2FDocument.txt',
      }),
    ).toBe('/Root/Content/Custom/Document.txt')
  })

  it('decodes query values only once and keeps literal percent characters', () => {
    expect(getTreeModeTargetPath({ ...parent, action: 'edit', search: '?content=%2FContent%2F100%25%252F.txt' })).toBe(
      '/Root/Content/100%%2F.txt',
    )
  })

  it('uses the parent folder for an unsaved new item and the root for a root action', () => {
    expect(getTreeModeTargetPath({ ...parent, action: 'new' })).toBe('/Root/Content')
    expect(getTreeModeTargetPath({ ...parent, action: 'edit' })).toBe('/Root')
  })

  it('derives the pressed mode from editing routes including direct URLs and browser history', () => {
    for (const action of ['edit', 'edit-binary', 'wopi-edit', 'new']) expect(isTreeEditAction(action)).toBe(true)
    for (const action of [undefined, 'browse', 'image', 'preview', 'wopi-view', 'version'])
      expect(isTreeEditAction(action)).toBe(false)
  })

  it('uses the grid for folder View and explicit browse for file View regardless of their primary action', () => {
    expect(getTreeModeAction({ IsFolder: true }, false)).toBeUndefined()
    expect(getTreeModeAction({ IsFolder: false }, false)).toBe('browse')
    expect(getTreeModeAction({ IsFolder: true }, true)).toBe('edit')
    expect(getTreeModeAction({ IsFolder: false }, true)).toBe('edit')
  })
})
