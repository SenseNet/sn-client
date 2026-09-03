import { PathHelper } from '@sensenet/client-utils'
import { ActionModel, GenericContent } from '@sensenet/default-content-types'
import { PATHS } from '../application-paths'

export const FULLSCREEN_EDIT_ACTION = 'EditBinary'

const fullscreenEditRoots = [PATHS.settings.snPath, PATHS.localization.snPath]

export const supportsFullscreenEdit = (content: GenericContent) => {
  const containingRoot = fullscreenEditRoots.find((rootPath) => PathHelper.isInSubTree(content.Path, rootPath))

  if (!containingRoot || content.Path === containingRoot) {
    return false
  }

  return content.IsFile === true || (content.IsFolder !== true && !content.Type?.endsWith('Folder'))
}

export const addFullscreenEditAction = (
  content: GenericContent,
  actions: ActionModel[],
  displayName?: string,
): ActionModel[] => {
  if (!supportsFullscreenEdit(content) || actions.some((action) => action.Name === FULLSCREEN_EDIT_ACTION)) {
    return actions
  }

  const fullscreenEditAction = {
    Name: FULLSCREEN_EDIT_ACTION,
    DisplayName: displayName || 'Full-screen edit',
  } as ActionModel
  const editActionIndex = actions.findIndex((action) => action.Name === 'Edit')

  if (editActionIndex === -1) {
    return [...actions, fullscreenEditAction]
  }

  return [...actions.slice(0, editActionIndex + 1), fullscreenEditAction, ...actions.slice(editActionIndex + 1)]
}
