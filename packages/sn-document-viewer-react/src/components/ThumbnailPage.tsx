import CircularProgress from '@material-ui/core/CircularProgress'
import Paper from '@material-ui/core/Paper'
import React from 'react'
import { DEFAULT_ZOOM_LEVEL, THUMBNAIL_NAME } from '..'
import { usePreviewImage, useViewerState } from '../hooks'
import { ImageUtil } from '../services'
import { THUMBNAIL_PADDING } from './DocumentViewerLayout'

/**
 * Defined the component's own properties
 */
export interface ThumbnailPageProps {
  imageIndex: number
  viewportHeight: number
  viewportWidth: number
  onClick: (ev: React.MouseEvent<HTMLElement>) => any
}

export const ThumbnailPage: React.FC<ThumbnailPageProps> = (props) => {
  const viewerState = useViewerState()
  const page = usePreviewImage(props.imageIndex)

  const isActive = page.image && viewerState.activePage === page.image.Index

  const imgUrl = (page.image && page.image.ThumbnailImageUrl) || ''

  const relativeImageSize = ImageUtil.getImageSize(
    {
      width: props.viewportWidth,
      height: props.viewportHeight,
    },
    {
      width: page.image?.Width || 0,
      height: page.image?.Height || 0,
      rotation: 0,
    },
    DEFAULT_ZOOM_LEVEL,
  )

  return (
    <Paper elevation={isActive ? 8 : 2} className={THUMBNAIL_NAME} style={{ margin: THUMBNAIL_PADDING }}>
      <div
        style={{
          padding: 0,
          overflow: 'hidden',
          width: relativeImageSize.width - 2 * THUMBNAIL_PADDING,
          height: relativeImageSize.height - 2 * THUMBNAIL_PADDING,
          position: 'relative',
        }}
        onClick={(ev) => {
          props.onClick(ev)
        }}>
        <span style={{ display: 'flex', justifyContent: 'center' }}>
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
