import { GenericContent } from '@sensenet/default-content-types'
import { useDownload, useLogger, useRepository } from '@sensenet/hooks-react'
import { useHistory } from 'react-router'
import { PATHS, resolvePathParams } from '../../application-paths'
import { useLoadContent } from '../../hooks'
import { useDialogActionService } from '../../hooks/use-dialogaction-service'
import { getPrimaryActionUrl } from '../../services'
import { useDialog } from '../dialogs'
import { contextMenuODataOptions } from './context-menu-odata-options'

export function useContextMenuActions(
  content: GenericContent,
  isOpened: boolean,
  setActions: (content: GenericContent) => void,
) {
  const logger = useLogger('context-menu')
  const history = useHistory()
  const repo = useRepository()
  const download = useDownload(content)
  const currentParent = useLoadContent({ idOrPath: content.ParentId!, isOpened }).content
  const { openDialog } = useDialog()
  const dialogActionService = useDialogActionService()

  const getContentName = () => content.DisplayName ?? content.Name

  const runAction = async (actionName: string) => {
    switch (actionName) {
      case 'Delete':
        openDialog({ name: 'delete', props: { content: [content] } })
        break
      case 'Edit':
        dialogActionService.activeAction.setValue('edit')
        break
      case 'Browse':
        dialogActionService.activeAction.setValue('browse')
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
        history.push(getPrimaryActionUrl(content, repo))
        break
      case 'CheckOut': {
        try {
          const checkOutresult = await repo.versioning.checkOut(content.Id, contextMenuODataOptions)
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
        history.push(
          resolvePathParams({
            path: PATHS.wopi.appPath,
            params: { action: 'view', contentId: content.Id.toString() },
          }),
        )
        break
      case 'WopiOpenEdit':
        history.push(
          resolvePathParams({
            path: PATHS.wopi.appPath,
            params: { action: 'edit', contentId: content.Id.toString() },
          }),
        )
        break
      case 'Versions':
        dialogActionService.activeAction.setValue('version')
        break
      case 'Publish':
        try {
          const publishResult = await repo.versioning.publish(content.Id, contextMenuODataOptions)
          logger.information({ message: `${getContentName()} published successfully.` })
          setActions(publishResult.d)
        } catch (error) {
          logger.warning({ message: `Couldn't publish ${getContentName()}`, data: error })
        }
        break
      case 'UndoCheckOut':
        try {
          const undoCheckOutResult = await repo.versioning.undoCheckOut(content.Id, contextMenuODataOptions)
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
      default:
        logger.warning({ message: `${actionName} is not implemented yet. Try to use it from command palette.` })
    }
  }

  return { runAction }
}
