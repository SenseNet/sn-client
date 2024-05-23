import { Disposable, PathHelper } from '@sensenet/client-utils'
import { ActionModel, GenericContent, Schema } from '@sensenet/default-content-types'
import { AuthenticationService } from '../Authentication/AuthenticationService'
import { BypassAuthentication } from '../Authentication/BypassAuthentication'
import { ODataSharingResponse } from '../Models'
import { Content, MovedContent } from '../Models/Content'
import { ODataBatchResponse } from '../Models/ODataBatchResponse'
import { ODataCollectionResponse } from '../Models/ODataCollectionResponse'
import { ODataParams } from '../Models/ODataParams'
import { ODataResponse } from '../Models/ODataResponse'
import { ODataWopiResponse } from '../Models/ODataWopiResponse'
import {
  ActionOptions,
  CopyOptions,
  DeleteOptions,
  GetActionOptions,
  LoadCollectionOptions,
  LoadOptions,
  MoveOptions,
  PatchOptions,
  PostOptions,
  PutOptions,
  SharingOptions,
} from '../Models/RequestOptions'
import { SchemaStore } from '../Schemas/SchemaStore'
import { AllowedChildTypes } from './AllowedChildTypes'
import { ConstantContent } from './ConstantContent'
import { ODataUrlBuilder } from './ODataUrlBuilder'
import { Preview } from './Preview'
import {
  defaultRepositoryConfiguration,
  RepositoryConfiguration,
  RepositoryConfigurationWithDefaults,
} from './RepositoryConfiguration'
import { Security } from './Security'
import { Upload } from './Upload'
import { Versioning } from './Versioning'

/**
 * Defines an extended error message instance that contains an original error instance, a response and a parsed JSON body from the response
 */
export type ExtendedError = Error & {
  body: any
  response: Response
  text?: string
  statusCode: number
  statusText: string
  url: string
}

/**
 * Type guard to check if an error is extended with a response and a parsed body
 * @param e The error to check
 */
export const isExtendedError = (e: Error): e is ExtendedError => {
  return (e as ExtendedError).response ? true : false
}

/**
 * Class that can be used as a main entry point to manipulate a sensenet content repository
 */
export class Repository implements Disposable {
  /**
   * Disposes the Repository object
   */
  public dispose() {
    this.authentication.dispose()
  }

  /**
   * Authentication service associated with the repository object
   */
  public authentication: AuthenticationService = new BypassAuthentication()

  /**
   * The configuration for the Repository object
   */
  public readonly configuration: RepositoryConfigurationWithDefaults

  /**
   * Async method that will be resolved when the Repository is ready to make HTTP calls
   */
  public async awaitReadyState(): Promise<void> {
    await Promise.all([this.authentication.checkForUpdate()])
  }

  /**
   * Wrapper for a native window.fetch method. The repository's readyState will be awaited and credentials will be included by default
   * @param {RequestInfo} input The RequestInfo object
   * @param {RequestInit} init Optional init parameters
   */
  public async fetch(input: RequestInfo, init?: RequestInit, awaitReadyState = true): Promise<Response> {
    if (awaitReadyState) {
      await this.awaitReadyState()
    }
    const request = new Request(input, init)
    if (this.configuration.token) {
      request.headers.append('Authorization', `Bearer ${this.configuration.token}`)
    }
    return await this.fetchMethod(request)
  }

  /**
   * Gets a more meaningful error object from a specific response
   * @param response The Response object to extract the message
   */
  public async getErrorFromResponse(response: Response): Promise<ExtendedError> {
    let msgFromBody = ''
    let body: any = {}
    let text = ''
    try {
      body = await response.json()
      msgFromBody = body.error.message.value
    } catch (error) {
      /** */
    }

    try {
      text = await response.text()
    } catch (error) {
      /** */
    }

    const error = new Error(msgFromBody || text || response.statusText) as ExtendedError
    error.body = body
    error.response = response
    error.text = text
    error.statusCode = response.status
    error.statusText = response.statusText
    error.url = response.url

    return error
  }

  /**
   * Loads a content from the content repository. If used with a fully qualified content path,
   * it will be transformed to an item path.
   * @param options Options for the Load request
   */
  public async load<TContentType extends Content>(
    options: LoadOptions<TContentType>,
  ): Promise<ODataResponse<TContentType>> {
    const contentPath = PathHelper.getContentUrl(options.idOrPath)
    const params = ODataUrlBuilder.buildUrlParamString(this.configuration, options.oDataOptions)
    const path = PathHelper.joinPaths(this.configuration.repositoryUrl, this.configuration.oDataToken, contentPath)
    const response = await this.fetch(`${path}?${params}`, {
      ...options.requestInit,
      credentials: 'include',
      method: 'GET',
    })
    if (!response.ok) {
      throw await this.getErrorFromResponse(response)
    }
    return await response.json()
  }

  /**
   * Loads a content collection from the repository
   * @param options Options for the Load request
   */
  public async loadCollection<TContentType extends Content>(
    options: LoadCollectionOptions<TContentType>,
  ): Promise<ODataCollectionResponse<TContentType>> {
    const params = ODataUrlBuilder.buildUrlParamString(this.configuration, options.oDataOptions)
    const path = PathHelper.joinPaths(this.configuration.repositoryUrl, this.configuration.oDataToken, options.path)
    const response = await this.fetch(`${path}?${params}`, {
      ...options.requestInit,
      credentials: 'include',
      method: 'GET',
    })
    if (!response.ok) {
      throw await this.getErrorFromResponse(response)
    }
    return await response.json()
  }

  /**
   * Returns the count of items in the requested collection.
   * The value depends on other optional query string parameters ($top, $skip, $filter, query, etc.) and does not depend on the $inlinecount parameter.
   */
  public async count<TContentType extends Content>(options: LoadCollectionOptions<TContentType>): Promise<number> {
    const params = ODataUrlBuilder.buildUrlParamString(this.configuration, options.oDataOptions)
    const path = PathHelper.joinPaths(this.configuration.repositoryUrl, this.configuration.oDataToken, options.path)
    const response = await this.fetch(`${path}/$count?${params}`, {
      ...options.requestInit,
      credentials: 'include',
      method: 'GET',
    })
    if (!response.ok) {
      throw await this.getErrorFromResponse(response)
    }
    return await response.json()
  }

  /**
   * Posts a new content to the content repository
   * @param options Post request Options
   */
  public async post<TContentType extends Content>(
    options: PostOptions<TContentType>,
  ): Promise<ODataResponse<TContentType>> {
    const path = PathHelper.joinPaths(
      this.configuration.repositoryUrl,
      this.configuration.oDataToken,
      options.parentPath,
    )
    const params = ODataUrlBuilder.buildUrlParamString(this.configuration, options.oDataOptions)
    const postBody: Partial<TContentType> & { __ContentType: string; __ContentTemplate?: string } = Object.assign(
      {},
      options.content,
    ) as any
    postBody.__ContentType = options.contentType
    postBody.__ContentTemplate = options.contentTemplate

    const response = await this.fetch(`${path}?${params}`, {
      ...options.requestInit,
      credentials: 'include',
      method: 'POST',
      body: JSON.stringify(postBody),
    })
    if (!response.ok) {
      throw await this.getErrorFromResponse(response)
    }
    if (response.status === 204) {
      return Promise.resolve({ d: null as any })
    }
    return await response.json()
  }

  /**
   * Updates an existing content in the repository using OData Patch
   * @param options Options for the Patch request
   */
  public async patch<TContentType extends Content>(
    options: PatchOptions<TContentType>,
  ): Promise<ODataResponse<TContentType>> {
    const contentPath = PathHelper.getContentUrl(options.idOrPath)
    const path = PathHelper.joinPaths(this.configuration.repositoryUrl, this.configuration.oDataToken, contentPath)
    const params = ODataUrlBuilder.buildUrlParamString(this.configuration, options.oDataOptions)
    const response = await this.fetch(`${path}?${params}`, {
      ...options.requestInit,
      credentials: 'include',
      method: 'PATCH',
      body: JSON.stringify(options.content),
    })
    if (!response.ok) {
      throw await this.getErrorFromResponse(response)
    }
    return await response.json()
  }

  /**
   * Updates an existing content in the repository using OData Put
   * @param options Options for the Put request
   */
  public async put<TContentType extends Content>(
    options: PutOptions<TContentType>,
  ): Promise<ODataResponse<TContentType>> {
    const contentPath = PathHelper.getContentUrl(options.idOrPath)
    const path = PathHelper.joinPaths(this.configuration.repositoryUrl, this.configuration.oDataToken, contentPath)
    const params = ODataUrlBuilder.buildUrlParamString(this.configuration, options.oDataOptions)
    const response = await this.fetch(`${path}?${params}`, {
      ...options.requestInit,
      credentials: 'include',
      method: 'PUT',
      body: JSON.stringify(options.content),
    })
    if (!response.ok) {
      throw await this.getErrorFromResponse(response)
    }
    return await response.json()
  }

  private createArray<T>(param: T[] | T): T[] {
    if (!(param instanceof Array)) {
      return [param]
    }
    return param
  }

  /**
   * Deletes a content or a content collection from the Repository
   * @param options Options for the Delete request
   */
  public async delete(options: DeleteOptions): Promise<ODataBatchResponse<Content>> {
    return await this.executeAction<{}, ODataBatchResponse<Content>>({
      idOrPath: ConstantContent.PORTAL_ROOT.Path,
      method: 'POST',
      name: 'DeleteBatch',
      requestInit: options.requestInit,
      body: {
        paths: this.createArray(options.idOrPath),
        permanent: options.permanent ?? false,
      },
    })
  }

  /**
   * Moves a content or content collection to a specified location
   * @param options Options for the Move request
   */
  public async move(options: MoveOptions): Promise<ODataBatchResponse<MovedContent>> {
    return await this.executeAction<{}, ODataBatchResponse<MovedContent>>({
      idOrPath: ConstantContent.PORTAL_ROOT.Path,
      method: 'POST',
      name: 'MoveBatch',
      requestInit: options.requestInit,
      body: {
        paths: this.createArray(options.idOrPath),
        targetPath: options.targetPath,
      },
    })
  }

  /**
   * Copies a content or content collection to a specified location
   * @param options Options for the Copy request
   */
  public async copy(options: CopyOptions): Promise<ODataBatchResponse<Content>> {
    return await this.executeAction<{}, ODataBatchResponse<Content>>({
      idOrPath: ConstantContent.PORTAL_ROOT.Path,
      method: 'POST',
      name: 'CopyBatch',
      requestInit: options.requestInit,
      body: {
        paths: this.createArray(options.idOrPath),
        targetPath: options.targetPath,
      },
    })
  }

  public async getPropertyValue(idOrPath: string | number, propertyName: string): Promise<string> {
    const path = PathHelper.joinPaths(
      this.configuration.repositoryUrl,
      this.configuration.oDataToken,
      PathHelper.getContentUrl(idOrPath),
      propertyName,
      '$value',
    )
    const response = await this.fetch(path)
    if (!response.ok) {
      throw await this.getErrorFromResponse(response)
    }
    return await response.text()
  }

  public async getMetadata(idOrPath?: string | number): Promise<any> {
    const path =
      idOrPath === undefined
        ? PathHelper.joinPaths(this.configuration.repositoryUrl, this.configuration.oDataToken, '$metadata')
        : PathHelper.joinPaths(
            this.configuration.repositoryUrl,
            this.configuration.oDataToken,
            PathHelper.getContentUrl(idOrPath),
            '$metadata',
          )

    const response = await this.fetch(`${path}?$format=json`)
    if (!response.ok) {
      throw await this.getErrorFromResponse(response)
    }
    return await response.json()
  }

  /**
   * Shares a content or content collection with a specified
   * @param options Options for the Copy request
   */
  public async share(options: SharingOptions): Promise<ODataSharingResponse> {
    return await this.executeAction<{}, ODataSharingResponse>({
      idOrPath: options.content.Id,
      method: 'POST',
      name: 'Share',
      body: {
        token: options.identity.toString(),
        content: options.content,
        level: options.sharingLevel,
        mode: options.sharingMode,
        sendNotification: options.sendNotification ?? true,
      },
    })
  }

  /**
   * Retrieves a list of content actions for a specified content
   * @param options Options for fetching the Custom Actions
   */
  public async getActions(options: GetActionOptions): Promise<{ d: { results: ActionModel[] } }> {
    const contextPath = PathHelper.getContentUrl(options.idOrPath)
    const path = PathHelper.joinPaths(
      this.configuration.repositoryUrl,
      this.configuration.oDataToken,
      contextPath,
      'Actions',
    )
    const response = await this.fetch(`${path}${options.scenario ? `?scenario=${options.scenario}` : ''}`, {
      credentials: 'include',
      method: 'GET',
    })
    if (!response.ok) {
      throw await this.getErrorFromResponse(response)
    }
    return await response.json()
  }

  /**
   * Returns data for loading Office document for editing
   * @param idOrPath Id or path of the document
   */
  public async getWopiData(options: {
    idOrPath: string | number
    action?: 'edit' | 'view'
    odataOptions?: ODataParams<GenericContent>
    requestInit?: RequestInit
  }): Promise<ODataWopiResponse> {
    return await this.executeAction<{}, ODataWopiResponse>({
      idOrPath: options.idOrPath,
      method: 'GET',
      name: 'GetWopiData',
      requestInit: options.requestInit,
      oDataOptions: {
        ...options.odataOptions,
        action: options.action || 'edit',
      } as any,
    })
  }

  /**
   * Executes a specified custom OData action
   * @param options Options for the Custom Action
   */
  public async executeAction<TBodyType, TReturns>(options: ActionOptions<TBodyType, any>): Promise<TReturns> {
    const contextPath = PathHelper.getContentUrl(options.idOrPath)
    let params = ODataUrlBuilder.buildUrlParamString(this.configuration, options.oDataOptions)
    const path = PathHelper.joinPaths(
      this.configuration.repositoryUrl,
      this.configuration.oDataToken,
      contextPath,
      options.name,
    )
    const requestOptions: RequestInit = {
      ...options.requestInit,
      credentials: 'include',
      method: options.method,
    }
    if (options.method === 'POST') {
      requestOptions.body = JSON.stringify(options.body)
    } else {
      options.body &&
        Object.keys(options.body).forEach(
          (key) => (params += `&${key}=${encodeURIComponent((options.body as any)[key])}`),
        )
    }
    const response = await this.fetch(`${path}?${params}`, requestOptions)
    if (!response.ok) {
      throw await this.getErrorFromResponse(response)
    }
    if (response.status === 204) {
      return Promise.resolve({} as TReturns)
    }
    return await response.json()
  }

  /**
   * Shortcut for security- and permission-related custom actions
   */
  public security: Security = new Security(this)

  /**
   * Shortcut for versioning related custom actions
   */
  public versioning: Versioning = new Versioning(this)

  /**
   * Shortcut for upload related custom actions
   */
  public upload: Upload = new Upload(this)

  /**
   * Shortcut for preview related custom actions
   */
  public preview: Preview = new Preview(this)

  /**
   * Shortcut for allowedChildTypes related custom actions
   */
  public allowedChildTypes: AllowedChildTypes = new AllowedChildTypes(this)

  /**
   * Reloads the content schemas from the sensenet backend
   * @returns {Promise<void>} A promise that will be resolved / rejected based on the action success
   */
  public async reloadSchema() {
    const schemas = await this.executeAction<undefined, Schema[]>({
      idOrPath: 'Root',
      name: 'GetSchema',
      method: 'GET',
      body: undefined,
    })
    this.schemas.setSchemas(schemas)
  }

  public iconCache = new Map<string, string>()

  constructor(
    config?: RepositoryConfiguration,
    private fetchMethod: WindowOrWorkerGlobalScope['fetch'] = window && window.fetch && window.fetch.bind(window),
    public schemas: SchemaStore = new SchemaStore(),
  ) {
    this.configuration = { ...defaultRepositoryConfiguration, ...config }
    this.schemas.setSchemas(this.configuration.schemas)
  }
}
