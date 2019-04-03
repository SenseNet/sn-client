import { Reducer } from 'redux'

/**
 * The zoom type definitions
 */
export type ZoomMode = 'originalSize' | 'fit' | 'fitHeight' | 'fitWidth' | 'custom'

/**
 * Type model for the Viewer state
 */
export interface ViewerStateType {
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
}

/**
 * Action to set the active page(s)
 * @param activePages
 */
export const setActivePages = (activePages: number[]) => ({
  type: 'SN_DOCVIEWER_DOCUMENT_VIEWER_SET_PAGE',
  activePages,
})

/**
 * Action to set the zoom mode
 * @param zoomMode
 */
export const setZoomMode = (zoomMode: ZoomMode) => ({
  type: 'SN_DOCVIEWER_DOCUMENT_VIEWER_SET_ZOOM_MODE',
  zoomMode,
})

/**
 * Action to set the zoom level to a custom value
 * @param customZoomLevel
 * @param defaultModeOnZero
 */
export const setCustomZoomLevel = (customZoomLevel: number, defaultModeOnZero: ZoomMode = 'fit') => ({
  type: 'SN_DOCVIEWER_DOCUMENT_VIEWER_SET_CUSTOM_ZOOM_LEVEL',
  customZoomLevel,
  defaultModeOnZero,
})

/**
 * Action to set the zoom level to a custom value
 * @param customZoomLevel
 */
export const setFitRelativeZoomLevel = (fitRelativeZoomLevel: number) => ({
  type: 'SN_DOCVIEWER_DOCUMENT_VIEWER_SET_FIT_RELATIVE_ZOOM_LEVEL',
  fitRelativeZoomLevel,
})

/**
 * Action to set the visibility of the watermark
 * @param isVisible
 */
export const setWatermark = (isVisible: boolean) => ({
  type: 'SN_DOCVIEWER_DOCUMENT_VIEWER_SET_WATERMARK',
  isVisible,
})

/**
 * Action to set the visibility of the redactions
 * @param isVisible
 */
export const setRedaction = (isVisible: boolean) => ({
  type: 'SN_DOCVIEWER_DOCUMENT_VIEWER_SET_REDACTION',
  isVisible,
})

/**
 * Action to set the visibility of the shapes
 * @param isVisible
 */
export const setShapes = (isVisible: boolean) => ({
  type: 'SN_DOCVIEWER_DOCUMENT_VIEWER_SET_SHAPES',
  isVisible,
})

/**
 * Action to set the visibility of the shapes
 * @param isVisible
 */
export const setThumbnails = (isVisible: boolean) => ({
  type: 'SN_DOCVIEWER_DOCUMENT_VIEWER_SET_THUMBNAILS',
  isVisible,
})

/**
 * Reducer for the Viewer state
 * @param state the current state
 * @param action the dispatched action
 */
export const viewerStateReducer: Reducer<ViewerStateType> = (
  state = {
    activePages: [1],
    zoomMode: 'fit',
    customZoomLevel: 3,
    showWatermark: false,
    showRedaction: true,
    showShapes: true,
    showThumbnails: false,
    fitRelativeZoomLevel: 0,
  },
  action,
) => {
  switch (action.type) {
    case 'SN_DOCVIEWER_DOCUMENT_RESET_DOCUMENT':
      return { ...state, activePages: [1] }
    case 'SN_DOCVIEWER_DOCUMENT_VIEWER_SET_PAGE':
      return { ...state, activePages: [...action.activePages] }
    case 'SN_DOCVIEWER_DOCUMENT_VIEWER_SET_ZOOM_MODE':
      return { ...state, zoomMode: action.zoomMode, customZoomLevel: 0 }
    case 'SN_DOCVIEWER_DOCUMENT_VIEWER_SET_CUSTOM_ZOOM_LEVEL':
      return {
        ...state,
        zoomMode: !action.customZoomLevel ? action.defaultModeOnZero : 'custom',
        customZoomLevel: action.customZoomLevel,
      }
    case 'SN_DOCVIEWER_DOCUMENT_VIEWER_SET_WATERMARK':
      return { ...state, showWatermark: action.isVisible }
    case 'SN_DOCVIEWER_DOCUMENT_VIEWER_SET_REDACTION':
      return { ...state, showRedaction: action.isVisible }
    case 'SN_DOCVIEWER_DOCUMENT_VIEWER_SET_SHAPES':
      return { ...state, showShapes: action.isVisible }
    case 'SN_DOCVIEWER_DOCUMENT_VIEWER_SET_THUMBNAILS':
      return { ...state, showThumbnails: action.isVisible }
    case 'SN_DOCVIEWER_DOCUMENT_VIEWER_SET_FIT_RELATIVE_ZOOM_LEVEL':
      return { ...state, fitRelativeZoomLevel: action.fitRelativeZoomLevel }
    default:
      return state
  }
}
