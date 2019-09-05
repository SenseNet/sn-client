import { Reducer } from 'redux'
import { IInjectableActionCallbackParams } from 'redux-di-middleware'
import { sleepAsync } from '@sensenet/client-utils'
import { PreviewState } from '../Enums'
import { DocumentData, DocumentViewerApiSettings, PreviewImageData, Shape, Shapes } from '../models'
import { Dimensions, ImageUtil } from '../services'
import { getAvailableImages } from './PreviewImages'
import { RootReducerType } from './RootReducer'

/**
 * Model for the document state
 */
export interface DocumentStateType {
  pollInterval: number
  idOrPath?: number | string
  version?: string
  document: DocumentData
  error?: string
  isLoading: boolean
  canEdit: boolean
  canHideWatermark: boolean
  canHideRedaction: boolean
  hasChanges: boolean
}

/**
 * Resets the document viewer state to the default.
 */
export const resetDocumentData = () => ({
  type: 'SN_DOCVIEWER_DOCUMENT_RESET_DOCUMENT',
})

/**
 * Action that updates the store with the received document data
 * @param document The received document data
 */
export const documentReceivedAction = (document: DocumentData) => ({
  type: 'SN_DOCVIEWER_DOCUMENT_DATA_RECEIVED',
  document,
})

/**
 * Action that updates the store with a document receive error
 * @param error The error message
 */
export const documentReceiveErrorAction = (error: any) => ({
  type: 'SN_DOCVIEWER_DOCUMENT_DATA_RECEIVE_ERROR',
  error,
})

/**
 * Action that updates the store with the given permission values
 * @param canEdit 'Can edit' permission value
 * @param canHideRedaction 'Can hide redaction' permission value
 * @param canHideWatermark 'Can hide watermark' permission value
 */
export const documentPermissionsReceived = (
  canEdit: boolean,
  canHideRedaction: boolean,
  canHideWatermark: boolean,
) => ({
  type: 'SN_DOCVEWER_DOCUMENT_PERMISSIONS_RECEIVED',
  canEdit,
  canHideRedaction,
  canHideWatermark,
})

/**
 * Thunk action that polls document data from the specified API
 * @param hostName the host name, e.g. 'https://my-sensenet-site.com'
 * @param idOrPath Id or full path for the document, e.g.: 'Root/Sites/MySite/MyDocLib/('doc.docx')
 * @param version The document version
 */
export const pollDocumentData = (hostName: string, idOrPath: string | number, version = 'V1.0A') => ({
  type: 'SN_POLL_DOCUMENT_DATA_INJECTABLE_ACTION',
  inject: async (options: IInjectableActionCallbackParams<RootReducerType>) => {
    const api = options.getInjectable<DocumentViewerApiSettings>(null as any)
    options.dispatch(resetDocumentData())
    let docData: DocumentData | undefined
    while (!docData || docData.pageCount === PreviewState.Loading) {
      try {
        docData = await api.getDocumentData({ idOrPath, hostName, version, abortController: new AbortController() })
        if (!docData || docData.pageCount === PreviewState.Loading) {
          await new Promise<void>(resolve =>
            setTimeout(() => {
              resolve()
            }, options.getState().sensenetDocumentViewer.documentState.pollInterval),
          )
        }
      } catch (error) {
        options.dispatch(documentReceiveErrorAction(error || Error('Error loading document')))
        return
      }
    }
    try {
      const [canEdit, canHideRedaction, canHideWatermark] = await Promise.all([
        await api.canEditDocument({ document: docData, abortController: new AbortController() }),
        await api.canHideRedaction({ document: docData, abortController: new AbortController() }),
        await api.canHideWatermark({ document: docData, abortController: new AbortController() }),
      ])
      options.dispatch(documentPermissionsReceived(canEdit, canHideRedaction, canHideWatermark))
    } catch (error) {
      options.dispatch(documentPermissionsReceived(false, false, false))
    }
    options.dispatch(documentReceivedAction(docData))
    options.dispatch<any>(getAvailableImages(docData))
  },
})

/**
 * Action that updates a provided shape data
 * @param shapeType the type of the shape
 * @param shapeGuid the unique identifyer for the shape
 * @param shapeData the new shape data
 */
export const updateShapeData = <K extends keyof Shapes>(shapeType: K, shapeGuid: string, shapeData: Shapes[K][0]) => ({
  type: 'SN_DOCVIEWER_DOCUMENT_UPDATE_SHAPE',
  shapeType,
  shapeGuid,
  shapeData,
})

/**
 * Action that removes a specified shape
 * @param shapeType The type of the shape
 * @param shapeGuid The unique identifier for the shape
 */
export const removeShape = <K extends keyof Shapes>(shapeType: K, shapeGuid: string) => ({
  type: 'SN_DOCVIEWER_DOCUMENT_REMOVE_SHAPE',
  shapeType,
  shapeGuid,
})

/**
 * Action that updates the polling interval
 * @param pollInterval The interval in millisecs
 */
export const setPollInterval = (pollInterval: number) => ({
  type: 'SN_DOCVIEWER_DOCUMENT_SET_POLL_INTERVAL',
  pollInterval,
})

/**
 * Action that will be fired when a save request has been sent
 */
export const saveChangesRequest = () => ({
  type: 'SN_DOCVEWER_DOCUMENT_SAVE_CHANGES_REQUEST',
})

/**
 * Action that will be fired on save error
 * @param error The error value
 */
export const saveChangesError = (error: any) => ({
  type: 'SN_DOCVEWER_DOCUMENT_SAVE_CHANGES_ERROR',
  error,
})

/**
 * Action that will be fired when saving succeeded
 */
export const saveChangesSuccess = () => ({
  type: 'SN_DOCVEWER_DOCUMENT_SAVE_CHANGES_SUCCESS',
})

/**
 * Action that rotates the specified shapes for the given page(s)
 * @param pages The pages to rotate
 * @param degree The rotation angle in degrees
 */
export const rotateShapesForPages = (pages: Array<{ index: number; size: Dimensions }>, degree: number) => ({
  type: 'SN_DOCVEWER_DOCUMENT_ROTATE_SHAPES_FOR_PAGES',
  pages,
  degree,
})

/**
 * Thunk action to call the Save endpoint with the current document state to save changes
 */
export const saveChanges = () => ({
  type: 'SN_DOCVIEWER_SAVE_CHANGES_INJECTABLE_ACTION',
  inject: async (options: IInjectableActionCallbackParams<RootReducerType>) => {
    const api = options.getInjectable<any>({} as any)
    options.dispatch(saveChangesRequest())
    try {
      await api.saveChanges(
        options.getState().sensenetDocumentViewer.documentState.document as DocumentData,
        options.getState().sensenetDocumentViewer.previewImages.AvailableImages as PreviewImageData[],
      )
      options.dispatch(saveChangesSuccess())
    } catch (error) {
      options.dispatch(saveChangesError(error))
    }
  },
})

/**
 * Thunk action to call the RegeneratePreviews endpoint for the current document and start polling the preview images
 */
export const regeneratePreviews = () => ({
  type: 'SN_DOCVIEWER_REGENERATE_PREVIEWS_INJECTABLE_ACTION',
  inject: async (options: IInjectableActionCallbackParams<RootReducerType>) => {
    const api = options.getInjectable<any>({} as any)
    const docData = options.getState().sensenetDocumentViewer.documentState.document as DocumentData
    try {
      await api.regeneratePreviews(docData)
    } catch (error) {
      // ignore -> reload
    }
    await sleepAsync(options.getState().sensenetDocumentViewer.documentState.pollInterval)
    options.dispatch(pollDocumentData(docData.hostName, docData.idOrPath))
  },
})

/**
 * helper method to apply shape rotations
 * @param shapes the shape(s) to rotate
 * @param degree the rotation angle in degrees
 * @param pages the page info
 */
export const applyShapeRotations = <T extends Shape>(
  shapes: T[],
  degree: number,
  pages: Array<{ index: number; size: Dimensions }>,
) => [
  ...shapes.map(s => {
    const page = pages.find(p => p.index === s.imageIndex)
    if (page) {
      const angle = (Math.PI / 180) * ImageUtil.normalizeDegrees(degree)
      const [sin, cos] = [Math.sin(angle), Math.cos(angle)]
      const oldX = s.x - page.size.height / 2
      const oldY = s.y - page.size.width / 2
      const newX = oldX * cos - oldY * sin
      const newY = oldY * cos + oldX * sin
      return {
        ...s,
        x: newX + page.size.height / 2,
        y: newY + page.size.width / 2,
      }
    }
    return s
  }),
]

/**
 * The default state data for the Document
 */
export const defaultState: DocumentStateType = {
  document: {
    hostName: '',
    shapes: {
      annotations: [],
      highlights: [],
      redactions: [],
    },
    documentName: '',
    documentType: '',
    fileSizekB: 0,
    idOrPath: 0,
    pageAttributes: [],
    pageCount: -1,
  },
  error: undefined,
  isLoading: true,
  idOrPath: undefined,
  version: undefined,
  canEdit: false,
  hasChanges: false,
  canHideRedaction: false,
  canHideWatermark: false,
  pollInterval: 2000,
}

/**
 * Reducer method for the document state
 * @param state the current state
 * @param action the action to dispatch
 */
export const documentStateReducer: Reducer<DocumentStateType> = (state = defaultState, action) => {
  switch (action.type) {
    case 'SN_DOCVIEWER_DOCUMENT_RESET_DOCUMENT':
      return { ...defaultState }
    case 'SN_DOCVIEWER_DOCUMENT_DATA_RECEIVED':
      return {
        ...state,
        document: { ...state.document, ...action.document },
        error: undefined,
        isLoading: false,
        hasChanges: false,
      }
    case 'SN_DOCVIEWER_DOCUMENT_DATA_RECEIVE_ERROR':
      return { ...state, document: { ...state.document, pageCount: 0 }, error: action.error, isLoading: false }
    case 'SN_DOCVIEWER_DOCUMENT_UPDATE_SHAPE':
      return {
        ...state,
        hasChanges: true,
        document: state.document && {
          ...state.document,
          shapes: {
            ...(state.document && state.document.shapes),
            [action.shapeType as keyof Shapes]:
              state.document &&
              state.document.shapes &&
              (state.document.shapes[action.shapeType as keyof Shapes] as Shape[])
                .map(shape => {
                  if (shape.guid === action.shapeGuid) {
                    return action.shapeData
                  }
                  return shape
                })
                .filter(shape => shape !== undefined),
          },
        },
      }
    case 'SN_DOCVIEWER_DOCUMENT_REMOVE_SHAPE':
      return {
        ...state,
        hasChanges: true,
        document: state.document && {
          ...state.document,
          shapes: {
            ...(state.document && state.document.shapes),
            [action.shapeType as keyof Shapes]:
              state.document &&
              state.document.shapes &&
              (state.document.shapes[action.shapeType as keyof Shapes] as Shape[]).filter(
                shape => shape && shape.guid !== action.shapeGuid,
              ),
          },
        },
      }
    case 'SN_DOCVEWER_DOCUMENT_ROTATE_SHAPES_FOR_PAGES':
      return {
        ...state,
        hasChanges: true,
        document: state.document && {
          ...state.document,
          shapes: {
            annotations: applyShapeRotations(state.document.shapes.annotations, action.degree, action.pages),
            highlights: applyShapeRotations(state.document.shapes.highlights, action.degree, action.pages),
            redactions: applyShapeRotations(state.document.shapes.redactions, action.degree, action.pages),
          },
        },
      }
    case 'SN_DOCVEWER_DOCUMENT_PERMISSIONS_RECEIVED':
      return {
        ...state,
        canEdit: action.canEdit,
        canHideRedaction: action.canHideRedaction,
        canHideWatermark: action.canHideWatermark,
      }
    case 'SN_DOCVEWER_DOCUMENT_SAVE_CHANGES_SUCCESS':
      return {
        ...state,
        hasChanges: false,
      }
    case 'SN_DOCVIEWER_DOCUMENT_SET_POLL_INTERVAL':
      return {
        ...state,
        pollInterval: action.pollInterval,
      }
    default:
      return state
  }
}
