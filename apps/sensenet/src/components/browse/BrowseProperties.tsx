import { createStyles, makeStyles } from '@material-ui/core'
import { CurrentContentProvider } from '@sensenet/hooks-react'
import clsx from 'clsx'
import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
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

const GenericContentEditor: React.FunctionComponent<RouteComponentProps<{ contentId?: string }>> = props => {
  const contentId = parseInt(props.match.params.contentId as string, 10)
  const selectionService = useSelectionService()
  const classes = useStyles()
  const globalClasses = useGlobalStyles()

  return (
    <div className={clsx(globalClasses.full, classes.editWrapper)}>
      <CurrentContentProvider
        idOrPath={contentId}
        onContentLoaded={c => selectionService.activeContent.setValue(c)}
        oDataOptions={{
          select: 'all',
          expand: ['Manager', 'FollowedWorkspaces'] as any,
        }}>
        <EditView
          uploadFolderpath={'/Root/Content/demoavatars'}
          handleCancel={props.history.goBack}
          actionName={'browse'}
        />
      </CurrentContentProvider>
    </div>
  )
}

export default withRouter(GenericContentEditor)
