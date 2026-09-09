import type { ODataParams } from '@sensenet/client-core'
import type { GenericContent } from '@sensenet/default-content-types'

type SortableTreeItem = Pick<GenericContent, 'DisplayName' | 'Name' | 'Type'> & { IsFolder?: boolean }

export const SETTINGS_FOLDER_FILTER = `not ((Name eq 'Settings') and (isOf('SystemFolder')))`

export const getTreeFilter = (showHiddenItems: boolean, showLeafItemsInTree: boolean) => {
  const filters: string[] = []

  if (!showLeafItemsInTree) {
    filters.push('IsFolder eq true')
  }

  if (!showHiddenItems) {
    filters.push(`(${SETTINGS_FOLDER_FILTER})`)
  }

  return filters.join(' and ')
}

export const getTreeItemLabel = (item: SortableTreeItem, preferDisplayName: boolean) => {
  if ((item.Type === 'ContentLink' || item.Name === '(favorites)') && item.DisplayName) {
    return item.DisplayName
  }

  return (preferDisplayName && item.DisplayName ? item.DisplayName : item.Name) || ''
}

export const isFolderLikeTreeItem = (item: SortableTreeItem) => {
  if (item.Type === 'ContentLink') {
    return false
  }

  return item.IsFolder === true || Boolean(item.Type?.toLowerCase().includes('folder'))
}

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
