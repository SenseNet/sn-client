import { GenericContent } from '@sensenet/default-content-types'
import { useDownload, useLogger, useRepository } from '@sensenet/hooks-react'
import { useHistory } from 'react-router'
import { useLoadContent } from '../../hooks'
import { ContentContextService } from '../../services'
import { useDialog } from '../dialogs'
import { contextMenuODataOptions } from './context-menu-odata-options'

export function useContextMenuActions(content: GenericContent, setActions: (content: GenericContent) => void) {
  const logger = useLogger('context-menu')
  const history = useHistory()
  const repo = useRepository()
  const routing = new ContentContextService(repo)
  const download = useDownload(content)
  const currentParent = useLoadContent({ idOrPath: content.ParentId! }).content
  const { openDialog } = useDialog()

  const getContentName = () => content.DisplayName ?? content.Name

  const runAction = async (actionName: string, halfPage?: boolean, setFormOpen?: () => void) => {
    switch (actionName) {
      case 'Delete':
        openDialog({ name: 'delete', props: { content: [content] } })
        break
      case 'Edit':
        !halfPage
          ? history.push(`/${btoa(repo.configuration.repositoryUrl)}/EditProperties/${content.Id}`)
          : setFormOpen && setFormOpen()
        break
      case 'Browse':
        if (!halfPage) {
          history.push(`/${btoa(repo.configuration.repositoryUrl)}/BrowseProperties/${content.Id}`)
        } else {
          setFormOpen && setFormOpen()
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
        history.push(routing.getPrimaryActionUrl(content))
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
        history.push(`/${btoa(repo.configuration.repositoryUrl)}/wopi/${content.Id}/view`)
        break
      case 'WopiOpenEdit':
        history.push(`/${btoa(repo.configuration.repositoryUrl)}/wopi/${content.Id}/edit`)
        break
      case 'Versions':
        openDialog({ name: 'versions', props: { content }, dialogProps: { maxWidth: 'md', open: true } })
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
