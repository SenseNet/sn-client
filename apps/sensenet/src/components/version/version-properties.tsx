import { createStyles, makeStyles } from '@material-ui/core'
import { PathHelper } from '@sensenet/client-utils'
import { Schema } from '@sensenet/default-content-types'
import { CurrentContentProvider, useRepository } from '@sensenet/hooks-react'
import clsx from 'clsx'
import React from 'react'
import { useHistory, useRouteMatch } from 'react-router'
import { useGlobalStyles } from '../../globalStyles'
import { useSelectionService } from '../../hooks'
import { useDialogActionService } from '../../hooks/use-dialogaction-service'
import { VersionView } from '../view-controls'

const useStyles = makeStyles(() => {
  return createStyles({
    versionsWrapper: {
      padding: '0',
      overflow: 'auto',
    },
  })
})

export default function VersionProperties() {
  const match = useRouteMatch<{ contentId: string }>()
  const history = useHistory<{ schema: Schema }>()
  const selectionService = useSelectionService()
  const classes = useStyles()
  const globalClasses = useGlobalStyles()
  const repo = useRepository()
  const dialogActionService = useDialogActionService()

  return (
    <div className={clsx(globalClasses.full, classes.versionsWrapper)}>
      <CurrentContentProvider
        idOrPath={match.params.contentId}
        onContentLoaded={(c) => {
          selectionService.activeContent.setValue(c)
        }}
        oDataOptions={{ select: 'all' }}>
        <div
          className={clsx(globalClasses.contentTitle, globalClasses.centeredVertical)}
          style={{ marginLeft: '30px' }}>
          <span style={{ fontSize: '20px' }}>Versions of {selectionService.activeContent.getValue()?.DisplayName}</span>
        </div>
        <VersionView
          handleCancel={async () => {
            if (selectionService.activeContent.getValue() !== undefined) {
              const parentContent = await repo.load({
                idOrPath: PathHelper.getParentPath(selectionService.activeContent.getValue()!.Path),
              })
              selectionService.activeContent.setValue(parentContent.d)
            }
            dialogActionService.activeAction.setValue(undefined)
            history.goBack()
          }}
          isFullPage={true}
        />
      </CurrentContentProvider>
    </div>
  )
}
