import { ObservableValue } from '@sensenet/client-utils'
import { GenericContent, User } from '@sensenet/default-content-types'
import { Content } from './Content'
import { ODataParams } from './ODataParams'
import { UploadProgressInfo } from './UploadProgressInfo'

/**
 * Request options with OData Model
 */
export interface WithOdataOptions<T> {
  /**
   * An OData Options object
   */
  oDataOptions?: ODataParams<T>
}

/**
 * Request options with Request Init parameter
 */
export interface WithRequestInit {
  /**
   * Additional fetch request init options
   */
  requestInit?: RequestInit
}

/**
 * Defines options for a Load request
 */
export interface LoadOptions<TContentType> extends WithOdataOptions<TContentType>, WithRequestInit {
  /**
   * The content Id or path to load
   */
  idOrPath: string | number

  /**
   * Optional content version parameter
   */
  version?: string
}

/**
 * Defines options for a collection load request
 */
export interface LoadCollectionOptions<TContentType> extends WithOdataOptions<TContentType>, WithRequestInit {
  /**
   * The collection path
   */
  path: string
}

/**
 * Defines options for a Post request
 */
export interface PostOptions<TContentType> extends WithOdataOptions<TContentType>, WithRequestInit {
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
}

/**
 * Defines options for a patch request
 */
export interface PatchOptions<TContentType> extends WithOdataOptions<TContentType>, WithRequestInit {
  /**
   * The id or path to the content that you want to patch
   */
  idOrPath: string | number
  /**
   * The content data to update
   */
  content: Partial<TContentType>
  /**
   * Force content list refresh
   */
  forceRefresh?: boolean
}

/**
 * Defines options for a Put request
 */
export interface PutOptions<TContentType> extends WithOdataOptions<TContentType>, WithRequestInit {
  /**
   * The id or path to the content that you want to update
   */
  idOrPath: string | number
  /**
   * The new content data
   */
  content: Partial<TContentType>
  /**
   * Force content list refresh
   */
  forceRefresh?: boolean
}

/**
 * Options for a delete request
 */
export interface DeleteOptions extends WithRequestInit {
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
export interface MoveOptions extends WithRequestInit {
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
export interface CopyOptions extends WithRequestInit {
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
export interface ActionOptions<TBody, TContentType> extends WithOdataOptions<TContentType>, WithRequestInit {
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
  body?: TBody
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
export interface UploadOptions<T> extends WithOdataOptions<T>, WithRequestInit {
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
  /**
   * The name of the File object. Overwriting this can be used to change a content's binary.
   */
  fileName?: string
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

export enum SharingLevel {
  Open = 'Open',
  Edit = 'Edit',
}

export enum SharingMode {
  Private = 'Private',
  Authenticated = 'Authenticated',
  Public = 'Public',
}

/**
 * Options for a content share request
 */
export interface SharingOptions extends WithRequestInit {
  /**
   * Content that will be shared
   */
  content: GenericContent
  /**
   * Email of the person or Id of the user whom the content will be shared with
   */
  identity: string | User
  /**
   * ‘permission set’ that want to be allowed for the target user (open, edit)
   */
  sharingLevel: SharingLevel
  /**
   * Determine who will get permissions to access the content
   */
  sharingMode: SharingMode
  /**
   * Determine if people will get a notification that something is shared with them or not. By default it is true.
   */
  sendNotification?: boolean
}
