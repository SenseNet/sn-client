import { PathHelper } from '@sensenet/client-utils'
import { GenericContent } from '@sensenet/default-content-types'
import { useDownload, useLogger, useRepository } from '@sensenet/hooks-react'
import { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { ResponsivePersonalSettings } from '../../context'
import { useLoadContent, useSnRoute } from '../../hooks'
import { getUrlForContent, navigateToAction } from '../../services'
import { useDialog } from '../dialogs'
import { contextMenuODataOptions } from './context-menu-odata-options'

export function useContextMenuActions(
  content: GenericContent,
  isOpened: boolean,
  setActions: (content: GenericContent) => void,
) {
  const logger = useLogger('context-menu')
  const history = useHistory()
  const repository = useRepository()
  const download = useDownload(content)
  const currentParent = useLoadContent({ idOrPath: content.ParentId!, isOpened }).content
  const { openDialog } = useDialog()
  const uiSettings = useContext(ResponsivePersonalSettings)
  const snRoute = useSnRoute()

  const getContentName = () => content.DisplayName ?? content.Name

  const runAction = async (actionName: string) => {
    switch (actionName) {
      case 'Delete':
        openDialog({ name: 'delete', props: { content: [content] } })
        break
      case 'Edit':
        if (snRoute.path && PathHelper.isInSubTree(content.Path, snRoute.path)) {
          navigateToAction({
            history,
            routeMatch: snRoute.match!,
            action: 'edit',
            queryParams: { content: content.Path.replace(snRoute.path, '') },
          })
        } else {
          history.push(getUrlForContent({ content, uiSettings, location: history.location, action: 'edit' }))
        }
        break
      case 'Browse':
        if (snRoute.path && PathHelper.isInSubTree(content.Path, snRoute.path)) {
          navigateToAction({
            history,
            routeMatch: snRoute.match!,
            action: 'browse',
            queryParams: { content: content.Path.replace(snRoute.path, '') },
          })
        } else {
          history.push(getUrlForContent({ content, uiSettings, location: history.location, action: 'browse' }))
        }
        break
      case 'MoveTo':
      case 'CopyTo': {
        const operation = actionName === 'CopyTo' ? 'copy' : 'move'
        openDialog({
          name: 'copy-move',
          props: { content: [content], currentParent: currentParent!, operation },
        })
        break
      }
      case 'Preview':
        if (snRoute.path && PathHelper.isInSubTree(content.Path, snRoute.path)) {
          navigateToAction({
            history,
            routeMatch: snRoute.match!,
            action: 'preview',
            queryParams: { content: content.Path.replace(snRoute.path, '') },
          })
        } else {
          history.push(getUrlForContent({ content, uiSettings, location: history.location, action: 'preview' }))
        }
        break
      case 'CheckOut': {
        try {
          const checkOutresult = await repository.versioning.checkOut(content.Id, contextMenuODataOptions)
          logger.information({
            message: `${getContentName()} checked out successfully.`,
          })
          setActions(checkOutresult.d)
        } catch (error) {
          logger.warning({
            message: `Couldn't check out ${getContentName()}`,
            data: error,
          })
        }
        break
      }
      case 'CheckIn':
        openDialog({
          name: 'check-in',
          props: {
            content,
            oDataOptions: contextMenuODataOptions,
            onActionSuccess: (checkInResult) => setActions(checkInResult),
          },
        })
        break
      case 'Download':
        download.download()
        break
      case 'WopiOpenView':
        if (snRoute.path && PathHelper.isInSubTree(content.Path, snRoute.path)) {
          navigateToAction({
            history,
            routeMatch: snRoute.match!,
            action: 'wopi-view',
            queryParams: { content: content.Path.replace(snRoute.path, '') },
          })
        } else {
          history.push(getUrlForContent({ content, uiSettings, location: history.location, action: 'wopi-view' }))
        }

        break
      case 'WopiOpenEdit':
        if (snRoute.path && PathHelper.isInSubTree(content.Path, snRoute.path)) {
          navigateToAction({
            history,
            routeMatch: snRoute.match!,
            action: 'wopi-edit',
            queryParams: { content: content.Path.replace(snRoute.path, '') },
          })
        } else {
          history.push(getUrlForContent({ content, uiSettings, location: history.location, action: 'wopi-edit' }))
        }
        break
      case 'Versions':
        if (snRoute.path && PathHelper.isInSubTree(content.Path, snRoute.path)) {
          navigateToAction({
            history,
            routeMatch: snRoute.match!,
            action: 'version',
            queryParams: { content: content.Path.replace(snRoute.path, '') },
          })
        } else {
          history.push(getUrlForContent({ content, uiSettings, location: history.location, action: 'version' }))
        }

        break
      case 'Publish':
        try {
          const publishResult = await repository.versioning.publish(content.Id, contextMenuODataOptions)
          logger.information({ message: `${getContentName()} published successfully.` })
          setActions(publishResult.d)
        } catch (error) {
          logger.warning({ message: `Couldn't publish ${getContentName()}`, data: error })
        }
        break
      case 'UndoCheckOut':
        try {
          const undoCheckOutResult = await repository.versioning.undoCheckOut(content.Id, contextMenuODataOptions)
          logger.information({ message: `${getContentName()} reverted successfully.` })
          setActions(undoCheckOutResult.d)
        } catch (error) {
          logger.warning({ message: `Couldn't undo checkout for ${getContentName()}`, data: error })
        }
        break
      case 'Approve':
        openDialog({
          name: 'approve',
          props: {
            content,
            oDataOptions: contextMenuODataOptions,
            onActionSuccess: (approveResult) => setActions(approveResult),
          },
        })
        break
      case 'SetPermissions':
        if (snRoute.path && content.Path.startsWith(snRoute.path)) {
          navigateToAction({
            history,
            routeMatch: snRoute.match!,
            action: 'setpermissions',
            queryParams: { content: content.Path.replace(snRoute.path, '') },
          })
        } else {
          history.push(getUrlForContent({ content, uiSettings, location: history.location, action: 'setpermissions' }))
        }
        break
      case 'Restore':
        openDialog({
          name: 'restore',
          props: {
            content,
          },
        })
        break
      default:
        logger.warning({ message: `${actionName} is not implemented yet. Try to use it from command palette.` })
    }
  }

  return { runAction }
}
