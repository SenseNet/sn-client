import { CommentData, CommentWithoutCreatedByAndId, DocumentData, PreviewImageData } from '@sensenet/client-core'

/**
 * Main settings for the Document Viewer component
 */
export interface DocumentViewerApiSettings {
  /**
   * Callback that will retrieve if the current user has permission for document editing
   */
  canEditDocument: (options: { document: DocumentData; abortController: AbortController }) => Promise<boolean>

  /**
   * Callback for saving changes to the document
   */
  saveChanges: (options: {
    document: DocumentData
    pages: PreviewImageData[]
    abortController: AbortController
  }) => Promise<void>

  /**
   * Callback for checking if the current user can hide the watermark
   */
  canHideWatermark: (options: { document: DocumentData; abortController: AbortController }) => Promise<boolean>

  /**
   * Callback for checking if the current user can hide the redaction
   */
  canHideRedaction: (options: { document: DocumentData; abortController: AbortController }) => Promise<boolean>

  /**
   * Callback that will return with the retrieved DocumentData (if available)
   */

  getDocumentData: (document: {
    idOrPath: number | string
    hostName: string
    version?: string
    abortController: AbortController
  }) => Promise<DocumentData>

  /**
   * Callback that will return with the retrieved PreviewImageData array
   */
  getExistingPreviewImages: (options: {
    document: DocumentData
    version: string
    showWatermark: boolean
    abortController: AbortController
  }) => Promise<PreviewImageData[]>

  /**
   * Callback for checking if a preview is available for a specified page
   */
  isPreviewAvailable: (options: {
    document: DocumentData
    version: string
    page: number
    showWatermark: boolean
    abortController: AbortController
  }) => Promise<PreviewImageData | undefined>

  /**
   * Callbacks for add, read, delete comments
   */
  commentActions: {
    getPreviewComments: (options: {
      document: DocumentData
      page: number
      abortController: AbortController
    }) => Promise<CommentData[]>
    addPreviewComment: (options: {
      document: DocumentData
      comment: CommentWithoutCreatedByAndId
      abortController: AbortController
    }) => Promise<CommentData>
    deletePreviewComment: (options: {
      document: DocumentData
      commentId: string
      abortController: AbortController
    }) => Promise<{ modified: boolean }>
  }

  regeneratePreviews: (options: { document: DocumentData; abortController: AbortController }) => Promise<void>
}
