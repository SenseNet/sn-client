import { useDownload, useLogger, useRepository, useWopi } from '@sensenet/hooks-react'
import { ActionModel, GenericContent } from '@sensenet/default-content-types'
import { useHistory } from 'react-router'
import { useContentRouting, useLoadContent } from '../../hooks'
import { useDialog } from '../dialogs'
import { contextMenuODataOptions } from './context-menu-odata-options'

export function useContextMenuActions(
  content: GenericContent,
  setActions: React.Dispatch<React.SetStateAction<ActionModel[] | undefined>>,
) {
  const logger = useLogger('context-menu')
  const history = useHistory()
  const repo = useRepository()
  const routing = useContentRouting()
  const download = useDownload(content)
  const wopi = useWopi(content)
  const currentParent = useLoadContent({ idOrPath: content.ParentId! }).content
  const { openDialog } = useDialog()

  const getContentName = () => content.DisplayName ?? content.Name

  const runAction = async (actionName: string) => {
    switch (actionName) {
      case 'Delete':
        openDialog({ name: 'delete', props: { content: [content] } })
        break
      case 'Edit':
        openDialog({ name: 'edit', props: { contentId: content.Id } })
        break
      case 'Browse':
        openDialog({ name: 'info', props: { content } })
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
        history.push(routing.getPrimaryActionUrl(content))
        break
      case 'CheckOut': {
        try {
          const checkOutresult = await repo.versioning.checkOut(content.Id, contextMenuODataOptions)
          logger.information({
            message: `${getContentName()} checked out successfully.`,
          })
          setActions(checkOutresult.d.Actions as ActionModel[])
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
            onActionSuccess: checkInResult => setActions(checkInResult.Actions as ActionModel[]),
          },
        })
        break
      case 'Download':
        download.download()
        break
      case 'WopiOpenView':
      case 'WopiOpenEdit':
        {
          history.push(
            `/${btoa(repo.configuration.repositoryUrl)}/wopi/${content.Id}/${wopi.isWriteAwailable ? 'edit' : 'view'}`,
          )
        }
        break
      case 'Versions':
        openDialog({ name: 'versions', props: { content }, dialogProps: { maxWidth: 'md', open: true } })
        break
      case 'Publish':
        try {
          const publishResult = await repo.versioning.publish(content.Id, contextMenuODataOptions)
          logger.information({ message: `${getContentName()} published successfully.` })
          setActions(publishResult.d.Actions as ActionModel[])
        } catch (error) {
          logger.warning({ message: `Couldn't publish ${getContentName()}`, data: error })
        }
        break
      case 'UndoCheckOut':
        try {
          const undoCheckOutResult = await repo.versioning.undoCheckOut(content.Id, contextMenuODataOptions)
          logger.information({ message: `${getContentName()} reverted successfully.` })
          setActions(undoCheckOutResult.d.Actions as ActionModel[])
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
            onActionSuccess: approveResult => setActions(approveResult.Actions as ActionModel[]),
          },
        })
        break
      default:
        logger.warning({ message: `${actionName} is not implemented yet. Try to use it from command palette.` })
    }
  }

  return { runAction }
}
