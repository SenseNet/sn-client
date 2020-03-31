import { createStyles, makeStyles } from '@material-ui/core'
import { Schema } from '@sensenet/default-content-types'
import { CurrentContentProvider } from '@sensenet/hooks-react'
import clsx from 'clsx'
import React from 'react'
import { useHistory, useRouteMatch } from 'react-router'
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

export default function EditProperties() {
  const match = useRouteMatch<{ contentId: string }>()
  const history = useHistory<{ schema: Schema }>()
  const selectionService = useSelectionService()
  const classes = useStyles()
  const globalClasses = useGlobalStyles()

  return (
    <div className={clsx(globalClasses.full, classes.editWrapper)}>
      <CurrentContentProvider
        idOrPath={match.params.contentId}
        onContentLoaded={c => {
          selectionService.activeContent.setValue(c)
        }}
        oDataOptions={{ select: 'all' }}>
        <EditView uploadFolderpath={'/Root/Content/demoavatars'} handleCancel={history.goBack} actionName={'edit'} />
      </CurrentContentProvider>
    </div>
  )
}
