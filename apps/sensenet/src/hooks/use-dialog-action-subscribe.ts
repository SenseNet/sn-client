import { useEffect } from 'react'
import { useHistory } from 'react-router'
import { applicationPaths, resolvePathParams } from '../application-paths'
import { useDialogActionService } from './use-dialogaction-service'
import { useSelectionService } from './use-selection-service'

export const useDialogActionSubscribe = () => {
  const dialogActionService = useDialogActionService()
  const selectionService = useSelectionService()
  const history = useHistory()

  useEffect(() => {
    const activeDialogActionObserve = dialogActionService.activeAction.subscribe((newDialogAction) => {
      if (selectionService.activeContent.getValue()) {
        switch (newDialogAction) {
          case 'edit':
            history.push(
              resolvePathParams({
                path: applicationPaths.editProperties,
                params: { contentId: selectionService.activeContent.getValue()!.Id },
              }),
            )
            break
          case 'browse':
            history.push(
              resolvePathParams({
                path: applicationPaths.browseProperties,
                params: { contentId: selectionService.activeContent.getValue()!.Id },
              }),
            )
            break
          case 'version':
            history.push(
              resolvePathParams({
                path: applicationPaths.versionProperties,
                params: { contentId: selectionService.activeContent.getValue()!.Id },
              }),
            )
            break
          default:
            break
        }
      }
    })

    return function cleanup() {
      activeDialogActionObserve.dispose()
    }
  }, [dialogActionService.activeAction, history, selectionService.activeContent])
}
