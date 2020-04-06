import {
  DocumentTitlePager,
  DocumentViewer,
  LayoutAppBar,
  RotateActivePagesWidget,
  RotateDocumentWidget,
  ToggleCommentsWidget,
  ToggleThumbnailsWidget,
  ZoomInOutWidget,
  ZoomModeWidget,
} from '@sensenet/document-viewer-react'
import React, { useCallback, useEffect } from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { Close } from '@material-ui/icons'
import { Button, createStyles, makeStyles } from '@material-ui/core'
import { CurrentContentProvider } from '@sensenet/hooks-react'
import clsx from 'clsx'
import { useLocalization, useSelectionService, useTheme } from '../hooks'
import { useGlobalStyles } from '../globalStyles'

const useStyles = makeStyles(() => {
  return createStyles({
    docViewerWrapper: {
      overflow: 'hidden',
    },
    closeButton: {
      placeSelf: 'flex-end',
      position: 'relative',
    },
  })
})

const DocViewer: React.FunctionComponent<RouteComponentProps<{ documentId: string }> & {
  previousLocation?: string
}> = props => {
  const documentId = parseInt(props.match.params.documentId, 10)
  const selectionService = useSelectionService()
  const localization = useLocalization()
  const theme = useTheme()
  const closeViewer = useCallback(() => {
    props.previousLocation ? props.history.push(props.previousLocation) : props.history.goBack()
  }, [props.history, props.previousLocation])
  const classes = useStyles()
  const globalClasses = useGlobalStyles()

  useEffect(() => {
    const keyboardHandler = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return
      }
      closeViewer()
    }

    document.addEventListener('keydown', keyboardHandler, false)
    return () => {
      document.removeEventListener('keydown', keyboardHandler, false)
    }
  }, [closeViewer, props])

  if (isNaN(documentId)) {
    throw Error(`Invalid document Id: ${documentId}`)
  }

  return (
    <div className={clsx(globalClasses.full, classes.docViewerWrapper)}>
      <CurrentContentProvider idOrPath={documentId} onContentLoaded={c => selectionService.activeContent.setValue(c)}>
        <DocumentViewer documentIdOrPath={documentId}>
          <LayoutAppBar>
            <div style={{ flexShrink: 0 }}>
              <ToggleThumbnailsWidget />
              <ZoomInOutWidget />
              <ZoomModeWidget />
              <RotateActivePagesWidget />
              <RotateDocumentWidget />
            </div>
            <DocumentTitlePager />
            <div style={{ display: 'flex', flexShrink: 0 }}>
              <ToggleCommentsWidget />
            </div>
            <div style={{ display: 'flex', flexShrink: 0 }}>
              <Button className={classes.closeButton} onClick={closeViewer}>
                <Close style={{ marginRight: theme.spacing(1) }} />
                {localization.customActions.resultsDialog.closeButton}
              </Button>
            </div>
          </LayoutAppBar>
        </DocumentViewer>
      </CurrentContentProvider>
    </div>
  )
}

const extendedComponent = withRouter(DocViewer)

export default extendedComponent
