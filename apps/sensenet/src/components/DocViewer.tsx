import {
  DocumentTitlePager,
  DocumentViewer,
  LayoutAppBar,
  RotateActivePagesWidget,
  RotateDocumentWidget,
  ROTATION_MODE,
  ToggleCommentsWidget,
  ToggleThumbnailsWidget,
  ZoomInOutWidget,
} from '@sensenet/document-viewer-react'
import { CurrentContentProvider, useLogger } from '@sensenet/hooks-react'
import { Button, createStyles, makeStyles, Theme } from '@material-ui/core'
import clsx from 'clsx'
import { Location } from 'history'
import React, { useCallback, useEffect } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { globals, useGlobalStyles } from '../globalStyles'
import { useLocalization, useSelectionService, useTheme } from '../hooks'

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

export default function DocViewer(props: { previousLocation?: Location }) {
  const match = useRouteMatch<{ contentId: string }>()
  const history = useHistory()
  const contentId = parseInt(match.params.contentId, 10)
  const logger = useLogger('DocViewer')
  const selectionService = useSelectionService()
  const localization = useLocalization()
  const theme = useTheme()
  const closeViewer = useCallback(() => {
    props.previousLocation ? history.push(props.previousLocation) : history.goBack()
  }, [history, props.previousLocation])
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

  if (isNaN(contentId)) {
    logger.error({ message: `Invalid document Id: ${contentId}` })
    return null
  }

  return (
    <>
      <div className={classes.docViewerWrapper}>
        <CurrentContentProvider
          idOrPath={contentId}
          onContentLoaded={(c) => selectionService.activeContent.setValue(c)}>
          <DocumentViewer documentIdOrPath={contentId}>
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
          </DocumentViewer>
        </CurrentContentProvider>
      </div>
      <div className={classes.actionButtonWrapper}>
        <Button color="default" className={globalClasses.cancelButton} onClick={closeViewer}>
          {localization.customActions.resultsDialog.closeButton}
        </Button>
      </div>
    </>
  )
}
