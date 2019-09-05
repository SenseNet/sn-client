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
  toggleComments: string
  firstPage: string
  previousPage: string
  gotoPage: string
  nextPage: string
  lastPage: string
  saveChanges: string
  loadingDocument: string
  regeneratePreviews: string
  regenerateButton: string
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
  deleteCommentDialogBody: string
  deleteCommentDialogTitle: string
  okButton: string
  cancelButton: string
  addComment: string
  commentInputPlaceholder: string
  submit: string
  inputRequiredError: string
  markerRequiredError: string
  markerTooltip: string
  commentSideBarTitle: string
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
export const localizationReducer: Reducer<LocalizationStateType> = (state = {} as any, action) => {
  switch (action.type) {
    case 'SN_DOCVIEWER_SET_LOCALIZATION': {
      return {
        ...state,
        ...action.localization,
      }
    }
    default:
      return state
  }
}
