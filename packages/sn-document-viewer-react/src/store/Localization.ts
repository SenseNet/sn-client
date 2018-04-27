import { Reducer } from 'redux'

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
    firstPage: string
    previousPage: string
    gotoPage: string
    nextPage: string
    lastPage: string
    saveChanges: string
    loadingDocument: string
    errorLoadingDocument: string
    errorLoadingDetails: string
    reloadPage: string
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
    firstPage: 'First page',
    previousPage: 'Previous page',
    gotoPage: 'Goto page',
    nextPage: 'Next page',
    lastPage: 'Last page',
    saveChanges: 'Save changes',
    loadingDocument: 'Loading document',
    errorLoadingDocument: 'Error loading document',
    errorLoadingDetails: 'The following error occured during opening a document: ',
    reloadPage: 'Reload page',
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
export const localizationReducer: Reducer<LocalizationStateType> = (state: LocalizationStateType = defaultLocalization, action ) => {
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
