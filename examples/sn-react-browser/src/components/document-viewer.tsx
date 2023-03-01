import { createStyles, IconButton, makeStyles, useTheme } from '@material-ui/core'
import { Close } from '@material-ui/icons'
import {
  DocumentTitlePager,
  DocumentViewer,
  LayoutAppBar,
  ToggleCommentsWidget,
  ToggleShapesWidget,
  ToggleThumbnailsWidget,
  ZoomInOutWidget,
} from '@sensenet/document-viewer-react'
import React from 'react'
import { RouteComponentProps, useHistory, withRouter } from 'react-router-dom'

const useAppBarStyles = makeStyles(() =>
  createStyles({
    appBar: {
      backgroundColor: '#342cac',
      color: '#FFFFFF',
    },
  }),
)

/**
 * Document viewer component
 */
const DocViewer: React.FunctionComponent<RouteComponentProps<{ documentId: string }>> = (props) => {
  const documentId = parseInt(props.match.params.documentId, 10)
  const history = useHistory()
  const layoutAppBarStyle = useAppBarStyles()
  const theme = useTheme()

  if (isNaN(documentId)) {
    throw Error(`Invalid document Id: ${documentId}`)
  }

  return (
    <>
      <DocumentViewer
        documentIdOrPath={documentId}
        renderAppBar={() => (
          <LayoutAppBar classes={layoutAppBarStyle}>
            <div style={{ flexShrink: 0 }}>
              <ToggleShapesWidget />
              <ToggleThumbnailsWidget />
              <ZoomInOutWidget />
            </div>
            <DocumentTitlePager />
            <div style={{ display: 'flex', flexShrink: 0 }}>
              <ToggleCommentsWidget />
              <IconButton aria-label="docviewer-close">
                <Close style={{ color: theme.palette.common.white }} onClick={history.goBack} />
              </IconButton>
            </div>
          </LayoutAppBar>
        )}
      />
    </>
  )
}

const DocviewerComponent = withRouter(DocViewer)

export default DocviewerComponent
