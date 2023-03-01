import { CircularProgress, createStyles, makeStyles, Paper, Theme } from '@material-ui/core'
import { PreviewImageData } from '@sensenet/client-core'
import React from 'react'
import { THUMBNAIL_NAME, THUMBNAIL_PADDING } from '../components'
import { usePreviewImage, useViewerState } from '../hooks'

const useStyles = makeStyles<Theme, ThumbnailPageProps>(() => {
  return createStyles({
    thumbnailPage: {
      padding: 0,
      overflow: 'hidden',
      width: ({ page }) => page.Width - 2 * THUMBNAIL_PADDING,
      height: ({ page }) => page.Height - 2 * THUMBNAIL_PADDING,
      position: 'relative',
    },
    image: {
      display: 'flex',
      justifyContent: 'center',
    },
  })
})

/**
 * Defined the component's own properties
 */
export interface ThumbnailPageProps {
  page: PreviewImageData
  viewportHeight: number
  viewportWidth: number
  onClick: (ev: React.MouseEvent<HTMLElement>) => any
}

export const ThumbnailPage: React.FC<ThumbnailPageProps> = (props) => {
  const classes = useStyles(props)
  const viewerState = useViewerState()
  const page = usePreviewImage(props.page.Index)

  const isActive = page.image && viewerState.activePage === page.image.Index

  const imgUrl = (page.image && page.image.ThumbnailImageUrl) || ''

  return (
    <Paper elevation={isActive ? 8 : 2} className={THUMBNAIL_NAME} style={{ margin: THUMBNAIL_PADDING }}>
      <div
        className={classes.thumbnailPage}
        onClick={(ev) => {
          props.onClick(ev)
        }}>
        <span className={classes.image}>
          {imgUrl ? (
            <img
              src={`${imgUrl}${viewerState.showWatermark ? '?watermark=true' : ''}`}
              alt=""
              style={{
                transition: 'transform .1s ease-in-out',
              }}
            />
          ) : (
            <CircularProgress style={{ marginTop: '50%' }} />
          )}
        </span>
      </div>
    </Paper>
  )
}
