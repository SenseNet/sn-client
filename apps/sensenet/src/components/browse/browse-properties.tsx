import { createStyles, makeStyles } from '@material-ui/core'
import { Schema } from '@sensenet/default-content-types'
import { CurrentContentProvider, useRepository } from '@sensenet/hooks-react'
import clsx from 'clsx'
import React from 'react'
import { useHistory, useRouteMatch } from 'react-router'
import { PathHelper } from '@sensenet/client-utils'
import { globals, useGlobalStyles } from '../../globalStyles'
import { useSelectionService } from '../../hooks'
import { EditView } from '../view-controls/edit-view'
import { useDialogActionService } from '../../hooks/use-dialogaction-service'

const useStyles = makeStyles(() => {
  return createStyles({
    editWrapper: {
      padding: '0',
      overflow: 'auto',
    },
    breadcrumbsWrapper: {
      height: globals.common.drawerItemHeight,
      boxSizing: 'border-box',
    },
  })
})

export default function BrowseProperties() {
  const match = useRouteMatch<{ contentId: string }>()
  const history = useHistory<{ schema: Schema }>()
  const selectionService = useSelectionService()
  const classes = useStyles()
  const globalClasses = useGlobalStyles()
  const repo = useRepository()
  const dialogActionService = useDialogActionService()

  return (
    <div className={clsx(globalClasses.full, classes.editWrapper)}>
      <CurrentContentProvider
        idOrPath={match.params.contentId}
        onContentLoaded={(content) => selectionService.activeContent.setValue(content)}
        oDataOptions={{
          select: 'all',
          expand: ['Manager', 'FollowedWorkspaces', 'ModifiedBy'] as any,
        }}>
        <div
          className={clsx(globalClasses.contentTitle, globalClasses.centeredVertical)}
          style={{ marginLeft: '30px' }}>
          <span style={{ fontSize: '20px' }}>Browse {selectionService.activeContent.getValue()?.DisplayName}</span>
        </div>
        <EditView
          uploadFolderpath="/Root/Content/demoavatars"
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
          actionName="browse"
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
