import { Schema } from '@sensenet/default-content-types'
import { CurrentContentProvider, useRepository } from '@sensenet/hooks-react'
import { PathHelper } from '@sensenet/client-utils'
import React from 'react'
import { useHistory, useRouteMatch } from 'react-router'
import { createStyles, makeStyles } from '@material-ui/core'
import clsx from 'clsx'
import { globals, useGlobalStyles } from '../../globalStyles'
import { useSelectionService } from '../../hooks'
import { EditView } from '../view-controls/edit-view'

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

  return (
    <div className={clsx(globalClasses.full, classes.editWrapper)}>
      <CurrentContentProvider
        idOrPath={match.params.contentId}
        onContentLoaded={(c) => selectionService.activeContent.setValue(c)}
        oDataOptions={{
          select: 'all',
          expand: ['Manager', 'FollowedWorkspaces'] as any,
        }}>
        <EditView
          uploadFolderpath="/Root/Content/demoavatars"
          handleCancel={async () => {
            if (selectionService.activeContent.getValue() !== undefined) {
              const parentContent = await repo.load({
                idOrPath: PathHelper.getParentPath(selectionService.activeContent.getValue()!.Path),
              })
              selectionService.activeContent.setValue(parentContent.d)
            }
            history.goBack()
          }}
          actionName="browse"
          isFullPage={true}
        />
      </CurrentContentProvider>
    </div>
  )
}
