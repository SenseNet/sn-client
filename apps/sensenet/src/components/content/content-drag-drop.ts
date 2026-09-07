import { GenericContent, isActionModel } from '@sensenet/default-content-types'

export type ContentDropOperation = 'copy' | 'move'
export const CONTENT_DRAG_TYPE = 'application/x-sensenet-content'
const normalizedPath = (path: string) => path.replace(/\/+$/, '').toLowerCase()
export const isWithinContent = (path: string, parent: string) => {
  const childPath = normalizedPath(path)
  const parentPath = normalizedPath(parent)
  return childPath === parentPath || childPath.startsWith(`${parentPath}/`)
}
export const contentParentPath = (path: string) => path.slice(0, path.lastIndexOf('/'))

export const getContentDragRoots = (items: GenericContent[]) =>
  items.filter(
    (item, index) =>
      items.findIndex((candidate) => candidate.Id === item.Id) === index &&
      !items.some((candidate) => candidate.Id !== item.Id && isWithinContent(item.Path, candidate.Path)),
  )

export const canDropContents = (items: GenericContent[], target: GenericContent, operation: ContentDropOperation) =>
  items.length > 0 &&
  !!target.IsFolder &&
  !!target.Path &&
  items.every(
    (item) =>
      !!item.Path &&
      !!item.Id &&
      normalizedPath(item.Path) !== '/root' &&
      !isWithinContent(target.Path, item.Path) &&
      (operation === 'copy' || normalizedPath(contentParentPath(item.Path)) !== normalizedPath(target.Path)) &&
      !(
        isActionModel(item.Actions) &&
        item.Actions.some((action) => action.Name === (operation === 'copy' ? 'CopyTo' : 'MoveTo') && action.Forbidden)
      ),
  ) &&
  !(isActionModel(target.Actions) && target.Actions.some((action) => action.Name === 'Add' && action.Forbidden))

export const contentDragAttributes = (content: GenericContent, source = true) => ({
  'data-explorer-content': JSON.stringify({
    Id: content.Id,
    Path: content.Path,
    Name: content.Name,
    DisplayName: content.DisplayName,
    Type: content.Type,
    IsFolder: content.IsFolder,
    Actions: content.Actions,
  }),
  'data-explorer-drag': source ? 'true' : undefined,
  draggable: source,
})
