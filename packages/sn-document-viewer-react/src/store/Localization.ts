import { Reducer } from 'redux'
import { PreviewState } from '../Enums'

/**
 * Model definition for the localization store
 */
export interface LocalizationStateType {
  rotateDocumentLeft: string
  rotateDocumentRight: string
  rotatePageLeft: string
  rotatePageRight: string
  zoomMode: string
  zoomModeFit: string
  zoomModeOriginalSize: string
  zoomModeFitHeight: string
  zoomModeFitWidth: string
  zooomModeCustom: string
  toggleRedaction: string
  toggleWatermark: string
  toggleShapes: string
  toggleThumbnails: string
  firstPage: string
  previousPage: string
  gotoPage: string
  nextPage: string
  lastPage: string
  saveChanges: string
  loadingDocument: string
  errorLoadingDocument: Array<{ state: PreviewState; message: string; details: string; code?: number }>
  errorLoadingDetails: string
  reloadPage: string
  search: string
  share: string
  download: string
  print: string
  showMore: string
  showLess: string
  avatarAlt: string
  delete: string
}

/**
 * Default localization string value
 */
export const defaultLocalization: LocalizationStateType = {
  rotateDocumentLeft: 'Rotate document left',
  rotateDocumentRight: 'Rotate document right',
  rotatePageLeft: 'Rotate page left',
  rotatePageRight: 'Rotate page right',
  zoomMode: 'Zoom mode',
  zoomModeFit: 'Fit',
  zoomModeOriginalSize: 'Original size',
  zoomModeFitHeight: 'Fit height',
  zoomModeFitWidth: 'Fit width',
  zooomModeCustom: 'Custom',
  toggleRedaction: 'Toggle redaction',
  toggleWatermark: 'Toggle watermark',
  toggleShapes: 'Toggle shapes',
  toggleThumbnails: 'Toggle thumbnails',
  firstPage: 'First page',
  previousPage: 'Previous page',
  gotoPage: 'Goto page',
  nextPage: 'Next page',
  lastPage: 'Last page',
  saveChanges: 'Save changes',
  loadingDocument: 'Preview image generation is in progress',
  errorLoadingDocument: [
    { state: PreviewState.Empty, message: "The document doesn't have any preview images", details: '' },
    {
      code: 500,
      state: PreviewState.Empty,
      message: 'Ooops! Something went wrong...',
      details:
        'An unexpected error seems to have occured. Why not try refreshing your page? If the page still not working try to check back later.',
    },
    {
      code: 404,
      state: PreviewState.Empty,
      message: 'Ooops! Something went wrong...',
      details: `You don't have permission to see this document \r\n The document you are trying to open has been deleted \r\n The document has been moved to another place `,
    },
    { state: PreviewState.UploadFailure, message: 'Failed to upload', details: '' },
    { state: PreviewState.UploadFailure2, message: 'Failed to upload', details: '' },
    {
      state: PreviewState.ExtensionFailure,
      message: 'Failed to generate preview images due to an extension error',
      details: '',
    },
    { state: PreviewState.NoPreviewProviderEnabled, message: 'There is no preview provider enabled', details: '' },
  ],
  errorLoadingDetails: 'The following error occured during opening a document: ',
  reloadPage: 'Reload page',
  search: 'Search',
  share: 'Share',
  download: 'Download',
  print: 'Print',
  showMore: '+ Show more',
  showLess: '+ Show less',
  avatarAlt: 'Picture of the commenter',
  delete: 'Delete',
}

/**
 * Action that updates the store with new localized values
 * @param localization The new localization values
 */
export const setLocalization = (localization: Partial<LocalizationStateType>) => ({
  type: 'SN_DOCVIEWER_SET_LOCALIZATION',
  localization,
})

/**
 * Reducer for localization
 * @param state the current state
 * @param action the action to dispatch
 */
export const localizationReducer: Reducer<LocalizationStateType> = (state = defaultLocalization, action) => {
  switch (action.type) {
    case 'SN_DOCVIEWER_SET_LOCALIZATION': {
      return {
        ...state,
        ...action.localization,
      }
    }
  }
  return state
}
