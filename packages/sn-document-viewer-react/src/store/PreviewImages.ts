import { Action, Reducer } from 'redux'
import { IInjectableActionCallbackParams } from 'redux-di-middleware'
import { DocumentData, DocumentViewerSettings, PreviewImageData } from '../models'
import { ImageUtil } from '../services'
import { getComments } from './Comments'
import { RootReducerType } from '.'

/**
 * Preview images store model definition
 */
export interface PreviewImagesStateType {
  /**
   * The polling interval in milliseconds
   */
  pollInterval: number

  /**
   * The received available images
   */
  AvailableImages: PreviewImageData[]

  /**
   * Flag that indicates if there are some changes (e.g. rotation)
   */
  hasChanges: boolean

  /**
   * The error message if there was error fetching image data
   */
  error: string | null
}

/**
 * Action that updates the store when the preview image fetching starts
 * @param documentData the provided document data
 */
export const getAvailabelImagesAction = (documentData: DocumentData) => ({
  type: 'SN_DOCVIEWER_PREVIEWS_GET_IMAGES',
  documentData,
})

/**
 * Action that updates the store with the received image data
 * @param imageData the received image data
 */
export const availabelImagesReceivedAction = (imageData: PreviewImageData[]) => ({
  type: 'SN_DOCVIEWER_PREVIEWS_IMAGES_RECEIVED',
  imageData,
})

/**
 * Action that updates the store with an error message when a fetching error happens
 * @param error The error message
 */
export const availabelImagesReceiveErrorAction = (error: string) => ({
  type: 'SN_DOCVIEWER_PREVIEWS_IMAGES_RECEIVE_ERROR',
  error,
})

/**
 * Action that rotates the pages with the provided index(es) with a given angle
 * @param imageIndexes The image indexes to rotate
 * @param amount The rotation amount in degrees
 */
export const rotateImages = (imageIndexes: number[], amount: number) => ({
  type: 'SN_DOCVIEWER_PREVIEWS_IMAGES_ROTATE',
  imageIndexes,
  amount,
})

/**
 * Thunk action that fetches the available image info from the provided API endpoint
 * @param documentData
 * @param version
 */
export const getAvailableImages = (documentData: DocumentData, version: string = 'V1.0A') => ({
  type: 'SN_GET_AVAILABLE_IMAGES_INJECTABLE_ACTION',
  inject: async (options: IInjectableActionCallbackParams<RootReducerType>) => {
    options.dispatch(getAvailabelImagesAction(documentData))
    const docViewerSettings = options.getInjectable(DocumentViewerSettings)
    let docData: PreviewImageData[] | undefined
    try {
      const state = options.getState()
      docData = await docViewerSettings.getExistingPreviewImages(
        documentData,
        version,
        state.sensenetDocumentViewer.viewer.showWatermark,
      )
    } catch (error) {
      options.dispatch(availabelImagesReceiveErrorAction(error.message || Error('Error getting preview images')))
      return
    }
    options.dispatch(availabelImagesReceivedAction(docData))
    options.dispatch(getComments())
  },
})

/**
 * Action that updates the store with the provided document data
 * @param documentData
 * @param version
 * @param page
 */
export const previewAvailableAction = (documentData: DocumentData, version: string, page: number) => ({
  type: 'SN_DOCVIEWER_PREVIEWS_PREVIEW_AVAILABLE',
  documentData,
  version,
  page,
})

/**
 * Action that updates the store with the received image data
 * @param documentData
 * @param version
 * @param page
 * @param imageData
 */
export const previewAvailableReceivedAction = (
  documentData: DocumentData,
  version: string,
  page: number,
  imageData: PreviewImageData,
) => ({
  type: 'SN_DOCVIEWER_PREVIEWS_PREVIEW_AVAILABLE_RECEIVED',
  documentData,
  version,
  page,
  imageData,
})

/**
 * Action that updates the state when no preview images are available
 */
export const previewNotAvailableReceivedAction = () => ({
  type: 'SN_DOCVIEWER_PREVIEWS_PREVIEW_NOT_AVAILABLE_RECEIVED',
})

/**
 * Action that updates the state with an error message
 * @param error The error message
 */
export const previewAvailableErrorAction = (error: string) => ({
  type: 'SN_DOCVIEWER_PREVIEWS_PREVIEW_AVAILABLE_ERROR',
  error,
})

/**
 * Action that sets the polling interval
 * @param pollInterval the new polling interval in millisecs
 */
export const setPagePollInterval = (pollInterval: number) => ({
  type: 'SN_DOCVIEWER_DOCUMENT_PAGE_SET_POLL_INTERVAL',
  pollInterval,
})

/**
 * Thunk action that fetches the available images from the provided API endpoint
 * @param documentData
 * @param version
 * @param page
 */
export const previewAvailable = (documentData: DocumentData, version: string = 'V1.0A', page: number = 1) => ({
  type: 'SN_DOCVIEWER_PREVIEW_AVAILABLE_INJECTABLE_ACTION',
  inject: async (options: IInjectableActionCallbackParams<RootReducerType>) => {
    options.dispatch(previewAvailableAction(documentData, version, page))
    const docViewerApi = options.getInjectable(DocumentViewerSettings)
    let docData: PreviewImageData | undefined
    try {
      const state = options.getState()
      docData = await docViewerApi.isPreviewAvailable(
        documentData,
        version,
        page,
        state.sensenetDocumentViewer.viewer.showWatermark,
      )
    } catch (error) {
      options.dispatch(
        availabelImagesReceiveErrorAction(error.message || Error(`Error getting preview image for page ${page}`)),
      )
      return
    }
    if (docData) {
      options.dispatch(previewAvailableReceivedAction(documentData, version, page, docData))
    } else {
      options.dispatch(previewNotAvailableReceivedAction())
    }
  },
})

/**
 * Reducer for the preview images
 * @param state the current state
 * @param action the dispatched action
 */
export const previewImagesReducer: Reducer<PreviewImagesStateType> = (
  state = { AvailableImages: [], error: null, hasChanges: false, pollInterval: 2000 },
  action,
) => {
  const actionCasted = action as Action & PreviewImagesStateType
  switch (actionCasted.type) {
    case 'SN_DOCVIEWER_PREVIEWS_GET_IMAGES':
      return { ...state, AvailableImages: [], error: null }
    case 'SN_DOCVIEWER_PREVIEWS_IMAGES_RECEIVED':
      return { ...state, hasChanges: false, AvailableImages: action.imageData }
    case 'SN_DOCVIEWER_PREVIEWS_IMAGES_RECEIVE_ERROR':
      return { ...state, AvailableImages: [], error: action.error }
    case 'SN_DOCVIEWER_PREVIEWS_IMAGES_ROTATE':
      return {
        ...state,
        hasChanges: true,
        AvailableImages: state.AvailableImages.map(img => {
          const newImg = { ...img }
          if (action.imageIndexes.indexOf(newImg.Index) >= 0) {
            const newAngle =
              ImageUtil.normalizeDegrees(
                ((newImg.Attributes && newImg.Attributes.degree) || 0) + (action.amount % 360),
              ) % 360
            newImg.Attributes = {
              ...newImg.Attributes,
              degree: newAngle,
            }
          }
          return newImg
        }),
      }
    case 'SN_DOCVIEWER_PREVIEWS_PREVIEW_AVAILABLE_RECEIVED':
      return {
        ...state,
        AvailableImages: state.AvailableImages.map(img => {
          if (img.Index === action.page) {
            return {
              Index: img.Index,
              ...action.imageData,
            }
          }
          return img
        }),
      }
    case 'SN_DOCVEWER_DOCUMENT_SAVE_CHANGES_SUCCESS':
      return {
        ...state,
        hasChanges: false,
      }
    case 'SN_DOCVIEWER_DOCUMENT_PAGE_SET_POLL_INTERVAL':
      return { ...state, pollInterval: actionCasted.pollInterval }
    default:
      return state
  }
}
