import { Button, createStyles, makeStyles, Theme } from '@material-ui/core'
import { Close } from '@material-ui/icons'
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
import { CurrentContentProvider } from '@sensenet/hooks-react'
import clsx from 'clsx'
import React, { useCallback, useEffect } from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { globals, useGlobalStyles } from '../globalStyles'
import { useLocalization, useSelectionService, useTheme } from '../hooks'

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    docViewerWrapper: {
      overflow: 'hidden',
      '& .MuiIconButton-root': {
        color: theme.palette.type === 'light' ? theme.palette.common.black : theme.palette.common.white,
      },
    },
    closeButton: {
      placeSelf: 'flex-end',
      position: 'relative',
      alignSelf: 'center',
    },
  })
})

const DocViewer: React.FunctionComponent<
  RouteComponentProps<{ documentId: string }> & {
    previousLocation?: string
  }
> = (props) => {
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
      <CurrentContentProvider idOrPath={documentId} onContentLoaded={(c) => selectionService.activeContent.setValue(c)}>
        <DocumentViewer documentIdOrPath={documentId}>
          <LayoutAppBar
            style={{
              backgroundColor:
                theme.palette.type === 'light' ? globals.light.drawerBackground : globals.dark.drawerBackground,
              border: theme.palette.type === 'light' ? clsx(globals.light.borderColor, '1px') : 'none',
              boxShadow: 'none',
              color: theme.palette.type === 'light' ? theme.palette.common.black : theme.palette.common.white,
            }}>
            <div style={{ flexShrink: 0 }}>
              <ToggleThumbnailsWidget
                style={{
                  fill: theme.palette.type === 'light' ? theme.palette.common.black : theme.palette.common.white,
                }}
                activeColor={theme.palette.primary.main}
              />
              <ZoomInOutWidget />
              <ZoomModeWidget />
              <RotateActivePagesWidget />
              <RotateDocumentWidget />
            </div>
            <DocumentTitlePager />
            <div>
              <ToggleCommentsWidget activeColor={theme.palette.primary.main} />
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
