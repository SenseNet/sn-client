import {
  DocumentTitlePager,
  LayoutAppBar,
  RotateActivePagesWidget,
  RotateDocumentWidget,
  ROTATION_MODE,
  DocumentViewer as SnDocumentViewer,
  ToggleCommentsWidget,
  ToggleThumbnailsWidget,
  ZoomInOutWidget,
} from '@sensenet/document-viewer-react'
import { CurrentContentProvider } from '@sensenet/hooks-react'
import { Button, createStyles, makeStyles, Theme } from '@material-ui/core'
import clsx from 'clsx'
import React, { useCallback, useEffect } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { globals, useGlobalStyles } from '../globalStyles'
import { useLocalization, useSelectionService, useTheme } from '../hooks'
import { navigateToAction } from '../services'

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    docViewerWrapper: {
      width: '100%',
      height: 'calc(100% - 80px)',
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
    actionButtonWrapper: {
      height: '80px',
      width: '100%',
      position: 'absolute',
      padding: '20px',
      bottom: 0,
      textAlign: 'right',
    },
  })
})

export function DocumentViewer(props: { contentPath: string }) {
  const routeMatch = useRouteMatch<{ browseType: string; action: string }>()
  const history = useHistory()
  const selectionService = useSelectionService()
  const localization = useLocalization()
  const theme = useTheme()
  const closeViewer = useCallback(() => navigateToAction({ history, routeMatch }), [history, routeMatch])
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

  return (
    <>
      <div className={classes.docViewerWrapper}>
        <CurrentContentProvider
          idOrPath={props.contentPath}
          onContentLoaded={(c) => selectionService.activeContent.setValue(c)}>
          <SnDocumentViewer documentIdOrPath={props.contentPath}>
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
                <RotateActivePagesWidget mode={ROTATION_MODE.clockwise} />
                <RotateDocumentWidget mode={ROTATION_MODE.clockwise} />
              </div>
              <DocumentTitlePager />
              <div>
                <ToggleCommentsWidget activeColor={theme.palette.primary.main} />
              </div>
            </LayoutAppBar>
          </SnDocumentViewer>
        </CurrentContentProvider>
      </div>
      <div className={classes.actionButtonWrapper}>
        <Button
          color="default"
          className={globalClasses.cancelButton}
          onClick={closeViewer}
          aria-label={localization.customActions.resultsDialog.closeButton}>
          {localization.customActions.resultsDialog.closeButton}
        </Button>
      </div>
    </>
  )
}
