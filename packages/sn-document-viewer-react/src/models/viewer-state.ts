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
}
