import { combineReducers } from 'redux'
import { documentStateReducer, DocumentStateType } from './Document'
import { localizationReducer, LocalizationStateType } from './Localization'

import { previewImagesReducer, PreviewImagesStateType } from './PreviewImages'
import { viewerStateReducer, ViewerStateType } from './Viewer'

/**
 * Type definitions for the sensenet document viewer root reducer
 */
export interface RootReducerType {
  sensenetDocumentViewer: {
    /**
     * Reducer for the document state
     */
    documentState: DocumentStateType

    /**
     * Reducer for the preview images
     */
    previewImages: PreviewImagesStateType

    /**
     * Reducer for the viewer state and settings
     */
    viewer: ViewerStateType

    /**
     * Reducer for the localized string resources
     */
    localization: LocalizationStateType
  }
}

/**
 * The root reducer instance with the sensenetDocumentViewer reducer instance
 */
export const rootReducer = combineReducers<RootReducerType>({
  sensenetDocumentViewer: combineReducers({
    documentState: documentStateReducer,
    previewImages: previewImagesReducer,
    viewer: viewerStateReducer,
    localization: localizationReducer,
  }),
})

/**
 * The sensenetDocumentViewerReducer instance
 */
export const sensenetDocumentViewerReducer = combineReducers({
  documentState: documentStateReducer,
  previewImages: previewImagesReducer,
  viewer: viewerStateReducer,
  localization: localizationReducer,
})
