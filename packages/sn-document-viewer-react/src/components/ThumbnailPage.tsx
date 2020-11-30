import { PreviewImageData } from '@sensenet/client-core'
import CircularProgress from '@material-ui/core/CircularProgress'
import Paper from '@material-ui/core/Paper'
import React from 'react'
import { THUMBNAIL_NAME } from '..'
import { usePreviewImage, useViewerState } from '../hooks'
import { THUMBNAIL_PADDING } from './DocumentViewerLayout'

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
  const viewerState = useViewerState()
  const page = usePreviewImage(props.page.Index)

  const isActive = page.image && viewerState.activePage === page.image.Index

  const imgUrl = (page.image && page.image.ThumbnailImageUrl) || ''

  return (
    <Paper elevation={isActive ? 8 : 2} className={THUMBNAIL_NAME} style={{ margin: THUMBNAIL_PADDING }}>
      <div
        style={{
          padding: 0,
          overflow: 'hidden',
          width: props.page.Width - 2 * THUMBNAIL_PADDING,
          height: props.page.Height - 2 * THUMBNAIL_PADDING,
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
