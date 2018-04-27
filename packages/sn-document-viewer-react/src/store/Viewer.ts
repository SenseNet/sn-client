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
 */
export const setCustomZoomLevel = (customZoomLevel: number) => ({
    type: 'SN_DOCVIEWER_DOCUMENT_VIEWER_SET_CUSTOM_ZOOM_LEVEL',
    customZoomLevel,
})

/**
 * Action to set the visibility of the watermark
 * @param showWatermark
 */
export const setWatermark = (showWatermark: boolean) => ({
    type: 'SN_DOCVIEWER_DOCUMENT_VIEWER_SET_WATERMARK',
    showWatermark,
})

/**
 * Action to set the visibility of the redactions
 * @param showRedaction
 */
export const setRedaction = (showRedaction: boolean) => ({
    type: 'SN_DOCVIEWER_DOCUMENT_VIEWER_SET_REDACTION',
    showRedaction,
})

/**
 * Action to set the visibility of the shapes
 * @param showShapes
 */
export const setShapes = (showShapes: boolean) => ({
    type: 'SN_DOCVIEWER_DOCUMENT_VIEWER_SET_SHAPES',
    showShapes,
})

/**
 * Reducer for the Viewer state
 * @param state the current state
 * @param action the dispatched action
 */
export const viewerStateReducer: Reducer<ViewerStateType> = (state = { activePages: [1], zoomMode: 'fit', customZoomLevel: 3, showWatermark: false, showRedaction: true, showShapes: true }, action) => {
    switch (action.type) {
        case 'SN_DOCVIEWER_DOCUMENT_VIEWER_SET_PAGE':
            return {...state, activePages: [...action.activePages] }
        case 'SN_DOCVIEWER_DOCUMENT_VIEWER_SET_ZOOM_MODE':
            return {...state, zoomMode: action.zoomMode, customZoomLevel: 0 }
        case 'SN_DOCVIEWER_DOCUMENT_VIEWER_SET_CUSTOM_ZOOM_LEVEL':
            return {...state, zoomMode: 'custom', customZoomLevel: action.customZoomLevel }
        case 'SN_DOCVIEWER_DOCUMENT_VIEWER_SET_WATERMARK':
            return {...state, showWatermark: action.showWatermark }
        case 'SN_DOCVIEWER_DOCUMENT_VIEWER_SET_REDACTION':
            return {...state, showRedaction: action.showRedaction }
        case 'SN_DOCVIEWER_DOCUMENT_VIEWER_SET_SHAPES':
            return {...state, showShapes: action.showShapes }
        default:
            return state
    }
}
