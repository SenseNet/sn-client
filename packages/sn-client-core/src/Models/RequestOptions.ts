import { ObservableValue } from '@sensenet/client-utils'
import { Repository } from '../index'
import { Content } from './Content'
import { ODataParams } from './ODataParams'
import { UploadProgressInfo } from './UploadProgressInfo'
/**
 * Defines options for a Load request
 */
export interface LoadOptions<TContentType> {
  /**
   * The content Id or path to load
   */
  idOrPath: string | number
  /**
   * An OData Options object
   */
  oDataOptions?: ODataParams<TContentType>
  /**
   * Optional content version parameter
   */
  version?: string
}

/**
 * Defines options for a collection load request
 */
export interface LoadCollectionOptions<TContentType> {
  /**
   * The collection path
   */
  path: string
  /**
   * an ODataOptions object
   */
  oDataOptions?: ODataParams<TContentType>
}

/**
 * Defines options for a Post request
 */
export interface PostOptions<TContentType> {
  /**
   * Path for a parent content
   */
  parentPath: string
  /**
   * Content data to post. The content type is required.
   */
  content: Partial<TContentType>

  /**
   * Type name for the content
   */
  contentType: string

  /**
   * An optional content template
   */
  contentTemplate?: string

  /**
   * An optional OData Options object
   */
  oDataOptions?: ODataParams<TContentType>
}

/**
 * Defines options for a patch request
 */
export interface PatchOptions<TContentType> {
  /**
   * The id or path to the content that you want to patch
   */
  idOrPath: string | number
  /**
   * The content data to update
   */
  content: Partial<TContentType>

  /**
   * An optional OData Options object
   */
  oDataOptions?: ODataParams<TContentType>
}

/**
 * Defines options for a Put request
 */
export interface PutOptions<TContentType> {
  /**
   * The id or path to the content that you want to update
   */
  idOrPath: string | number
  /**
   * The new content data
   */
  content: Partial<TContentType>

  /**
   * An optional OData Options object
   */
  oDataOptions?: ODataParams<TContentType>
}

/**
 * Options for a delete request
 */
export interface DeleteOptions {
  /**
   * The id(s) or path(list) for a content(s) to delete
   */
  idOrPath: string | number | Array<number | string>
  /**
   * Permantent flag for a delete request
   */
  permanent?: boolean
}

/**
 * Options for a content move request
 */
export interface MoveOptions {
  /**
   * The id(s) or path(list) for a content(s) to move
   */
  idOrPath: string | number | Array<number | string>
  /**
   * The target path to move
   */
  targetPath: string
  /**
   * Optional content to call the action
   */
  rootContent?: Content
}

/**
 * Options for a content copy request
 */
export interface CopyOptions {
  /**
   * The id(s) or path(list) for a content(s) to copy
   */
  idOrPath: string | number | Array<number | string>
  /**
   * Path of a target content
   */
  targetPath: string
  /**
   * Optional content to call the action
   */
  rootContent?: Content
}

/**
 * Options to call an odata action
 */
export interface ActionOptions<TBody, TContentType> {
  /**
   * The name of the odata action
   */
  name: string
  /**
   * The http method
   */
  method: 'GET' | 'POST'
  /**
   * The context content for the action
   */
  idOrPath: string | number
  /**
   * Additional body parameters
   */
  body: TBody

  /**
   * An OData Options object
   */
  oDataOptions?: ODataParams<TContentType>
}

/**
 * Options for fetching content actions
 */
export interface GetActionOptions {
  /**
   * The content Id or path
   */
  idOrPath: string | number

  /**
   * An optional Scenario parameter
   */
  scenario?: string
}

/**
 * Options for uploading content
 */
export interface UploadOptions<T> {
  /**
   * The specified sensenet Repository instance
   */
  repository: Repository

  /**
   * The name of the content type, e.g.: File
   */
  contentTypeName?: string
  /**
   * Name of the binary property on the content, e.g.: Binary
   */
  binaryPropertyName: string
  /**
   * Enable overwriting a file if already exists
   */
  overwrite: boolean
  /**
   * Additional post body options
   */
  body?: any

  /**
   * Additional OData options
   */
  odataOptions?: ODataParams<T>
  /**
   * The path of the parent content
   */
  parentPath: string

  /**
   * Optional observable that will be updated with the upload progress
   */
  progressObservable?: ObservableValue<UploadProgressInfo>
}

/**
 * Options for uploading a File into the repository
 */
export interface UploadFileOptions<T> extends UploadOptions<T> {
  /**
   * The File instance
   */
  file: File
}

/**
 * Options for uploading a text as a binary file into the repository
 */
export interface UploadTextOptions<T> extends UploadOptions<T> {
  /**
   * The text to be uploaded
   */
  text: string
  /**
   * The name of the File object
   */
  fileName: string
}

/**
 * Options for uploading content from a drop event
 */
export interface UploadFromEventOptions<T extends Content> extends UploadOptions<T> {
  /**
   * The path of the parent content item
   */
  parentPath: string

  /**
   * The DragEvent to work with. File data will be extracted from it's 'dataTransfer' item.
   */
  event: DragEvent
  /**
   * Option if folders should be created as well.
   */
  createFolders: boolean
}

/**
 * Options for uploading files from a FileList object
 */
export interface UploadFromFileListOptions<T extends Content> extends UploadOptions<T> {
  /**
   * The FileList object
   */
  fileList: FileList
  /**
   * Option to create folders. Files will be uploaded to the root
   */
  createFolders: boolean
}
