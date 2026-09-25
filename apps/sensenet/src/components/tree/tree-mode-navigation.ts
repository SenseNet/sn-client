import type { GenericContent } from '@sensenet/default-content-types'

export const isTreeEditAction = (action?: string) => ['edit', 'edit-binary', 'wopi-edit', 'new'].includes(action || '')

/** Action pages display the content query target, which may differ from the folder behind them. */
export const getTreeModeTargetPath = ({
  rootPath,
  currentPath,
  action,
  search,
}: {
  rootPath: string
  currentPath: string
  action?: string
  search: string
}) => {
  if (!action || action === 'new') return currentPath
  const params = new URLSearchParams(search)
  const contentPath = params.get('content') || ''
  return action === 'edit' && params.get('needRoot') === 'false' ? contentPath : `${rootPath}${contentPath}`
}

/** View is explicitly read-only, even for files whose normal primary action is an editor. */
export const getTreeModeAction = (content: Pick<GenericContent, 'IsFolder'>, edit: boolean) =>
  edit ? 'edit' : content.IsFolder ? undefined : 'browse'
