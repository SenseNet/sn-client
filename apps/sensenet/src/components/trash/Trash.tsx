import { ODataParams } from '@sensenet/client-core'
import { TrashBin } from '@sensenet/default-content-types'
import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { applicationPaths, resolvePathParams } from '../../application-paths'
import { useGlobalStyles } from '../../globalStyles'
import { useSelectionService } from '../../hooks'
import { useDialogActionService } from '../../hooks/use-dialogaction-service'
import { useLoadContent } from '../../hooks/use-loadContent'
import { SimpleList } from '../content/Simple'
import TrashHeader from './TrashHeader'

const oDataOptions: ODataParams<TrashBin> = { select: 'all' }

const Trash = React.memo(() => {
  const { content } = useLoadContent<TrashBin>({ idOrPath: '/Root/Trash', oDataOptions })
  const globalClasses = useGlobalStyles()
  const history = useHistory()
  const dialogActionService = useDialogActionService()
  const selectionService = useSelectionService()

  useEffect(() => {
    const activeDialogActionObserve = dialogActionService.activeAction.subscribe(
      (newDialogAction) =>
        selectionService.activeContent.getValue() &&
        (newDialogAction === 'edit'
          ? history.push(
              resolvePathParams({
                path: applicationPaths.editProperties,
                params: { contentId: selectionService.activeContent.getValue()!.Id },
              }),
            )
          : newDialogAction === 'browse' &&
            history.push(
              resolvePathParams({
                path: applicationPaths.browseProperties,
                params: { contentId: selectionService.activeContent.getValue()!.Id },
              }),
            )),
    )

    return function cleanup() {
      activeDialogActionObserve.dispose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogActionService.activeAction])

  return (
    <div className={globalClasses.contentWrapper}>
      {content ? (
        <TrashHeader
          iconClickHandler={() =>
            history.push(
              resolvePathParams({ path: applicationPaths.editProperties, params: { contentId: content.Id } }),
            )
          }
          trash={content}
        />
      ) : null}
      <SimpleList
        parent="/Root/Trash"
        contentListProps={{
          enableBreadcrumbs: false,
          fieldsToDisplay: ['DisplayName', 'ModificationDate', 'ModifiedBy', 'Actions'],
        }}
      />
    </div>
  )
})

export default Trash
