import type { ODataParams } from '@sensenet/client-core'
import type { GenericContent } from '@sensenet/default-content-types'

type SortableTreeItem = Pick<GenericContent, 'DisplayName' | 'Name' | 'Type'> & { IsFolder?: boolean }

export const SETTINGS_FOLDER_FILTER = `not ((Name eq 'Settings') and (isOf('SystemFolder')))`

export const getTreeItemLabel = (item: SortableTreeItem, preferDisplayName: boolean) =>
  (preferDisplayName && item.DisplayName ? item.DisplayName : item.Name) || ''

export const isFolderLikeTreeItem = (item: SortableTreeItem) =>
  item.Type ? item.Type.toLowerCase().includes('folder') : item.IsFolder === true

export const compareTreeItems =
  (preferDisplayName: boolean, sortFoldersFirst: boolean) => (left: SortableTreeItem, right: SortableTreeItem) => {
    if (sortFoldersFirst) {
      const folderOrder = Number(!isFolderLikeTreeItem(left)) - Number(!isFolderLikeTreeItem(right))

      if (folderOrder) {
        return folderOrder
      }
    }

    return (
      getTreeItemLabel(left, preferDisplayName).localeCompare(getTreeItemLabel(right, preferDisplayName), undefined, {
        sensitivity: 'base',
      }) ||
      (left.Name || '').localeCompare(right.Name || '', undefined, {
        sensitivity: 'base',
      })
    )
  }

export const getTreeOrderBy = (preferDisplayName: boolean): ODataParams<GenericContent>['orderby'] =>
  preferDisplayName
    ? [
        ['DisplayName', 'asc'],
        ['Name', 'asc'],
      ]
    : [['Name', 'asc']]
