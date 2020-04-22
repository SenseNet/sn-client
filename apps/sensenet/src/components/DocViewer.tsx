import { Button, createStyles, makeStyles } from '@material-ui/core'
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
import { CurrentContentProvider, useLogger } from '@sensenet/hooks-react'
import clsx from 'clsx'
import React, { useCallback, useEffect } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { useGlobalStyles } from '../globalStyles'
import { useLocalization, useSelectionService, useTheme } from '../hooks'

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

export default function DocViewer(props: { previousLocation?: string }) {
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
    <div className={clsx(globalClasses.full, classes.docViewerWrapper)}>
      <CurrentContentProvider idOrPath={contentId} onContentLoaded={(c) => selectionService.activeContent.setValue(c)}>
        <DocumentViewer documentIdOrPath={contentId}>
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
