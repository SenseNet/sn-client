import { Store } from 'redux'
import { v1 } from 'uuid'
import { DocumentData, DocumentViewerSettings, PreviewImageData } from '../src/models'
import { configureStore, RootReducerType } from '../src/store'

/**
 * Example document data for document viewer context
 */
export const exampleDocumentData: DocumentData = {
    documentName: 'example doc',
    hostName: 'https://example-host',
    documentType: 'word',
    idOrPath: 'example/id/or/path',
    shapes: {
        annotations: [
            {
                index: 1,
                h: 100,
                w: 100,
                x: 10,
                y: 10,
                text: 'Example Text',
                guid: v1(),
                lineHeight: 15,
                fontBold: '34',
                imageIndex: 1,
                fontColor: 'red',
                fontFamily: 'arial',
                fontItalic: 'false',
                fontSize: '12pt',
            },
        ],
        highlights: [
            {
                guid: v1(),
                imageIndex: 1,
                h: 100,
                w: 100,
                x: 100,
                y: 100,
            },
        ],
        redactions: [
            {
                guid: v1(),
                imageIndex: 1,
                h: 100,
                w: 100,
                x: 200,
                y: 200,
            },
        ],
    },
    fileSizekB: 128,
    pageAttributes: [
        {
            options: {
                degree: 3,
            },
            pageNum: 1,
        },
    ],
    pageCount: 1,
}

/**
 * Example preview image data for document viewer context
 */
export const examplePreviewImageData: PreviewImageData = {
    Attributes: {
        degree: 0,
    },
    Height: 1024,
    Width: 768,
    Index: 1,
    PreviewImageUrl: '/',
    ThumbnailImageUrl: '/',
}

/**
 * Default settings for document viewer context
 */
export const defaultSettings: DocumentViewerSettings = new DocumentViewerSettings({
    canEditDocument: async () => true,
    canHideRedaction: async () => true,
    canHideWatermark: async () => true,
    getDocumentData: async () => exampleDocumentData,
    getExistingPreviewImages: async () => [examplePreviewImageData],
    isPreviewAvailable: async () => examplePreviewImageData,
    saveChanges: async () => undefined,
})

/**
 * Model interface for the text contetxt
 */
export interface DocViewerTestContext {
    /**
     * A store instance
     */
    store: Store<RootReducerType>,
    /**
     * The provided settings
     */
    settings: DocumentViewerSettings,
}

/**
 * Helper method that allows you to execute tests within a provided context.
 * Usage:
 * ```ts
 * useTestContextWithSettings(
 * {
 *      // you can define the options that you want to override
 * },
 * (context)=>{
 *      // the internal test implementaion
 *      // you can access the preconfigured store and viewer settings on the context parameter
 * })
 * ```
 * @param {Partial<DocumentViewerSettings>} additionalSettings A partial settings object. The provided properties will override the default ones
 * @param {(context: DocViewerTestContext) => void} callback Callback for the internal test implemetation
 */
export const useTestContextWithSettings = (additionalSettings: Partial<DocumentViewerSettings>, callback: (context: DocViewerTestContext) => void) => {
    const settings = new DocumentViewerSettings({
        ...defaultSettings,
        ...additionalSettings,
    })
    const store = configureStore(settings)
    callback({ store, settings })
}

/**
 * Helper method that allows you to execute tests within a provided context.
 * Usage:
 * ```ts
 * useTestContext((context)=>{
 *      // the internal test implementaion
 *      // you can access the preconfigured store and viewer settings on the context parameter
 * })
 * ```
 * @param {(context: DocViewerTestContext) => void} callback Callback for the internal test implemetation
 */
export const useTestContext: (callback: (context: DocViewerTestContext) => void) => void
    = (callback) => useTestContextWithSettings({}, callback)

/**
 * Helper method that allows you to execute tests within a provided context. Supports async / await
 * Usage:
 * ```ts
 * await useTestContextWithSettingsAsync(
 * {
 *      // you can define the options that you want to override
 * }, async (context)=>{
 *      // the internal test implementaion
 *      // you can access the preconfigured store and viewer settings on the context parameter
 *      await someAsyncOperation()
 * })
 * ```
 * @param {Partial<DocumentViewerSettings>} additionalSettings A partial settings object. The provided properties will override the default ones
 * @param {(context: DocViewerTestContext) => Promise<void>} callback Callback for the internal test implemetation
 */
export const useTestContextWithSettingsAsync = async (additionalSettings: Partial<DocumentViewerSettings>, callback: (context: DocViewerTestContext) => Promise<void>) => {
    const settings = new DocumentViewerSettings({
        ...defaultSettings,
        ...additionalSettings,
    })
    const store = configureStore(settings)
    await callback({ store, settings })
}

/**
 * Helper method that allows you to execute tests within a provided context.
 * Usage:
 * ```ts
 * await useTestContextAsync(async (context)=>{
 *      // the internal test implementaion
 *      // you can access the preconfigured store and viewer settings on the context parameter
 *      await someAsyncOperation()
 * })
 * ```
 * @param {(context: DocViewerTestContext) => Promise<void>} callback Callback for the internal test implemetation
 */
export const useTestContextAsync: (callback: (context: DocViewerTestContext) => Promise<void>) => Promise<void>
    = (callback) => useTestContextWithSettingsAsync({}, callback)
