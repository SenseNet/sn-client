import { createStyles, makeStyles } from '@material-ui/core'
import { Schema } from '@sensenet/default-content-types'
import { CurrentContentProvider } from '@sensenet/hooks-react'
import clsx from 'clsx'
import React from 'react'
import { useHistory, useRouteMatch } from 'react-router'
import { useGlobalStyles } from '../../globalStyles'
import { useSelectionService } from '../../hooks'
import { useDialogActionService } from '../../hooks/use-dialogaction-service'
import { EditView } from '../view-controls/edit-view'

const useStyles = makeStyles(() => {
  return createStyles({
    editWrapper: {
      padding: '0',
      overflow: 'auto',
    },
  })
})

export default function EditProperties() {
  const match = useRouteMatch<{ contentId: string }>()
  const history = useHistory<{ schema: Schema }>()
  const selectionService = useSelectionService()
  const classes = useStyles()
  const globalClasses = useGlobalStyles()
  const dialogActionService = useDialogActionService()

  return (
    <div className={clsx(globalClasses.full, classes.editWrapper)}>
      <CurrentContentProvider
        idOrPath={match.params.contentId}
        onContentLoaded={(content) => {
          selectionService.activeContent.setValue(content)
        }}
        oDataOptions={{ select: 'all' }}>
        <div
          className={clsx(globalClasses.contentTitle, globalClasses.centeredVertical)}
          style={{ marginLeft: '30px' }}>
          <span style={{ fontSize: '20px' }}>
            Edit <span style={{ fontWeight: 500 }}>{selectionService.activeContent.getValue()?.DisplayName}</span>
          </span>
        </div>
        <EditView
          uploadFolderpath={'/Root/Content/demoavatars'}
          handleCancel={history.goBack}
          actionName={'edit'}
          isFullPage={true}
          submitCallback={() => {
            dialogActionService.activeAction.setValue(undefined)
            history.goBack()
          }}
        />
      </CurrentContentProvider>
    </div>
  )
}
