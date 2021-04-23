import { ObservableValue } from '@sensenet/client-utils'

/**
 * Active shape to draw
 */

export type ActiveShapPlacingOptions = 'redaction' | 'highlight' | 'annotation' | 'none'

/**
 * Rotation model
 */
export interface RotationModel {
  /**
   * The index of the page
   */
  pageNum: number

  /**
   * Rotation in degrees
   */
  degree: number
}

export interface pageRectModel {
  /**
   * The index in the visible pages array
   */
  visiblePage: number

  /**
   * DOM rect attributes
   */
  pageRect: DOMRect
}

/**
 * Type model for the Viewer state
 */
export interface ViewerState {
  /**
   * The active page
   */
  activePage: number
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
  zoomLevel: number

  /**
   * Rotation
   */
  rotation?: RotationModel[]

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
   * Variable that indicates if a shape placing is in progress
   */
  activeShapePlacing: ActiveShapPlacingOptions

  /**
   * Indicates if the user is creating a comment at the moment
   */
  isCreateCommentActive: boolean

  /**
   *
   */
  pageToGo: ObservableValue<{ page: number }>

  /**
   * The attributes of the visible pages
   */
  pagesRects: pageRectModel[]

  /**
   * The attributes of the viewbox
   */
  boxPosition: {
    left: number
    right: number
    top: number
    bottom: number
  }
}
