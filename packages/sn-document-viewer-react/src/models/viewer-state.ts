import { ObservableValue } from '@sensenet/client-utils'

/**
 * The zoom type definitions
 */
export type ZoomMode = 'originalSize' | 'fit' | 'fitHeight' | 'fitWidth' | 'custom'

/**
 * Type model for the Viewer state
 */
export interface ViewerState {
  /**
   * The active page(s)
   */
  activePages: number[]
  /**
   * The current zoom mode
   */
  zoomMode: ZoomMode
  /**
   * The current zoom level
   */
  customZoomLevel: number
  /**
   * Watermark is on / off
   */
  showWatermark: boolean
  /**
   * Redaction is on / off
   */
  showRedaction: boolean
  /**
   * Shapes are on / off
   */
  showShapes: boolean

  /**
   * Thumbnails on / off
   */
  showThumbnails: boolean

  /**
   * Zoom level relative to the fitted image size
   */
  fitRelativeZoomLevel: number

  /**
   * Determines if comments are shown
   */
  showComments: boolean

  /**
   * True if there are any changes on the document
   */
  hasChanges: boolean

  /**
   * Variable that indicates if a comment marker placing is in progress
   */
  isPlacingCommentMarker: boolean

  /**
   * Indicates if the user is creating a comment at the moment
   */
  isCreateCommentActive: boolean

  /**
   *
   */
  onPageChange: ObservableValue<number>

  /**
   *
   */
  visiblePages: number[]
}
