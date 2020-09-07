/**
 * @module Repository
 */
/** */

import { Content, LoadCollectionOptions, LoadOptions, ODataParams } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'

/**
 * Model for Content Created event
 */
export interface Created {
  /**
   * The created Content instance
   */
  content: Content
}

/**
 * Model for Content Creation Failed event
 */
export interface CreateFailed {
  /**
   * The unsaved Content instance
   */
  content: Content

  /**
   * The Error that caused the failure
   */
  error: any
}

/**
 * Model for Content Modified event
 */
export interface Modified {
  /**
   * The Content instance that has been modified.
   */
  content: Content

  /**
   * The Change data
   */
  changes: Content

  /**
   * Force the refresh of the content list
   */
  forceRefresh?: boolean
}

/**
 * Model for Content Modification Failed event
 */
export interface ModificationFailed {
  /**
   * The Content instance that has been failed to modify
   */
  content: Partial<Content>
  /**
   * The Error that caused the failure
   */
  error: any
}

/**
 * Model for Content Loaded event
 */
export interface Loaded {
  /**
   * The Loaded content instance
   */
  content: Content
}

/**
 * Model for Content Loaded failed event
 */
export interface LoadFailed {
  /**
   * The Load payload for the request
   */
  payload: LoadOptions<GenericContent>
  /**
   * The Error instance
   */
  error: any
}

/**
 * Model for the Load Content Collection event
 */
export interface LoadCollectionFailed {
  /**
   * The collection payload for the request
   */
  payload: LoadCollectionOptions<GenericContent>
  /**
   * the error instance
   */
  error: any
}

/**
 * Model for Content Deleted event
 */
export interface Deleted {
  /**
   * The Content data that has been deleted
   */
  contentData: Content
  /**
   * Indicates if the Content was deleted permanently or just moved to Trash
   */
  permanently: boolean
}

/**
 * Model for more Contents Deleted event
 */
export interface BatchDeleted {
  /**
   * The Content datas have been deleted
   */
  contentDatas: Content[]
  /**
   * Indicates if the Content was deleted permanently or just moved to Trash
   */
  permanently: boolean
}

/**
 * Model for Content Delete failed event
 */
export interface DeleteFailed {
  /**
   * The Content that you've tried to delete
   */
  content: Content
  /**
   * Indicates if you've tried to delete the Content permanently or just tried to move it to the Trash
   */
  permanently: boolean

  /**
   * The Error that caused the failure
   */
  error: any
}

export interface BatchDeleteFailedData {
  /**
   * The Content that you've tried to delete
   */
  content: Content
  /**
   * The Error that caused the failure
   */
  error: any
}

/**
 * Model for more Contents Delete failed event
 */
export interface BatchDeleteFailed {
  /**
   * Indicates if you've tried to delete the Contents permanently or just tried to move it to the Trash
   */
  permanently: boolean

  data: BatchDeleteFailedData[]
}

/**
 * Model for Custom Action executed event
 */
export interface CustomActionExecuted<T extends Content> {
  /**
   * The Action options
   */
  actionOptions: any
  /**
   * The additional OData parameters (optional)
   */
  oDataParams?: ODataParams<T>
  /**
   * The Action result
   */
  result: any
}

/**
 * Model for Custom Action Failed event
 */
export interface CustomActionFailed<T extends Content> {
  /**
   * The Action options
   */
  actionOptions: any
  /**
   * The additional OData parameters (optional)
   */
  oDataParams?: ODataParams<T>
  /**
   * The Error that caused the failure
   */
  error: any
}

/**
 * Model for Content renamed event
 */
export interface ContentMoved {
  /**
   * The moved Content instance
   */
  content: Content
}

/**
 * Model for Content Move failed event
 */
export interface ContentMoveFailed {
  /**
   * The Content instance that you've tried to move
   */
  content: Content
  /**
   * The Error that caused the failure
   */
  error: any
}

/**
 * Model for Content renamed event
 */
export interface ContentCopied {
  /**
   * The copied Content instance
   */
  content: Content
  /**
   * The original Content instance
   */
  originalContent: string | number | Array<string | number>
}

/**
 * Model for Content Move failed event
 */
export interface ContentCopyFailed {
  /**
   * The Content instance that you've tried to copy
   */
  content: Content
  /**
   * The Error that caused the failure
   */
  error: any
}
