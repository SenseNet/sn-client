import { Injector } from '@furystack/inject'
import { Comment, CommentWithoutCreatedByAndId } from './Comment'
import { DocumentData, PreviewImageData } from '.'

/**
 * Main settings for the Document Viewer component
 */
export interface DocumentViewerSettingsOptions {
  /**
   * Callback that will retrieve if the current user has permission for document editing
   */
  canEditDocument: (document: DocumentData) => Promise<boolean>

  /**
   * Callback for saving changes to the document
   */
  saveChanges: (document: DocumentData, pages: PreviewImageData[]) => Promise<void>

  /**
   * Callback for checking if the current user can hide the watermark
   */
  canHideWatermark: (document: DocumentData) => Promise<boolean>

  /**
   * Callback for checking if the current user can hide the redaction
   */
  canHideRedaction: (document: DocumentData) => Promise<boolean>

  /**
   * Callback that will return with the retrieved DocumentData (if available)
   */

  getDocumentData: (document: {
    idOrPath: number | string
    hostName: string
    version?: string
  }) => Promise<DocumentData | undefined>

  /**
   * Callback that will return with the retrieved PreviewImageData array
   */
  getExistingPreviewImages: (
    document: DocumentData,
    version: string,
    showWatermark: boolean,
  ) => Promise<PreviewImageData[]>

  /**
   * Callback for checking if a preview is available for a specified page
   */
  isPreviewAvailable: (
    document: DocumentData,
    version: string,
    page: number,
    showWatermark: boolean,
  ) => Promise<PreviewImageData | undefined>

  /**
   * Callbacks for add, read, delete comments
   */
  commentActions: {
    getPreviewComments: (document: DocumentData, page: number) => Promise<Comment[]>
    addPreviewComment: (document: DocumentData, comment: CommentWithoutCreatedByAndId) => Promise<Comment>
    deletePreviewComment: (document: DocumentData, commentId: string) => Promise<{ modified: boolean }>
  }
}

/**
 * A Document Viewer Settings object that will be used as a singleton service
 */
export class DocumentViewerSettings implements DocumentViewerSettingsOptions {
  public injector = new Injector()

  public commentActions!: {
    getPreviewComments: (document: DocumentData, page: number) => Promise<Comment[]>
    addPreviewComment: (document: DocumentData, comment: CommentWithoutCreatedByAndId) => Promise<Comment>
    deletePreviewComment: (document: DocumentData, commentId: string) => Promise<{ modified: boolean }>
  }
  public canEditDocument!: (document: DocumentData) => Promise<boolean>
  public saveChanges!: (document: DocumentData, pages: PreviewImageData[]) => Promise<void>
  public canHideWatermark!: (document: DocumentData) => Promise<boolean>
  public canHideRedaction!: (document: DocumentData) => Promise<boolean>
  public getDocumentData!: (document: {
    idOrPath: string | number
    hostName: string
    version?: string
  }) => Promise<DocumentData | undefined>
  public getExistingPreviewImages!: (
    document: DocumentData,
    version: string,
    showWatermark: boolean,
  ) => Promise<PreviewImageData[]>
  public isPreviewAvailable!: (
    document: DocumentData,
    version: string,
    page: number,
    showWatermark: boolean,
  ) => Promise<PreviewImageData | undefined>
  constructor(options: DocumentViewerSettingsOptions) {
    Object.assign(this, options)
  }
}
