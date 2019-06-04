import { Disposable, PathHelper } from '@sensenet/client-utils'
import { ActionModel, ContentType, Schema } from '@sensenet/default-content-types'
import { AuthenticationService } from '../Authentication/AuthenticationService'
import { BypassAuthentication } from '../Authentication/BypassAuthentication'
import { Content } from '../Models/Content'
import { ODataBatchResponse } from '../Models/ODataBatchResponse'
import { ODataCollectionResponse } from '../Models/ODataCollectionResponse'
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
} from '../Models/RequestOptions'
import { SchemaStore } from '../Schemas/SchemaStore'
import { ConstantContent } from './ConstantContent'
import { ODataUrlBuilder } from './ODataUrlBuilder'
import { RepositoryConfiguration } from './RepositoryConfiguration'
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
  public readonly configuration: RepositoryConfiguration

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
  public async fetch(info: RequestInfo, init?: RequestInit, awaitReadyState: boolean = true): Promise<Response> {
    if (awaitReadyState) {
      await this.awaitReadyState()
    }
    return await this.fetchMethod(
      info,
      init || {
        credentials: 'include',
      },
    )
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
        permanent: options.permanent,
      },
    })
  }

  /**
   * Moves a content or content collection to a specified location
   * @param options Options for the Move request
   */
  public async move(options: MoveOptions): Promise<ODataBatchResponse<Content>> {
    return await this.executeAction<{}, ODataBatchResponse<Content>>({
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

  /**
   * Retrieves a list of content actions for a specified content
   * @param options Options for fetching the Custom Actions
   */
  public async getActions(options: GetActionOptions): Promise<{ d: { Actions: ActionModel[] } }> {
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
   * Retrieves an aggregated list of content types the user can create as children below the given content
   * @param {LoadOptions<ContentType>} options
   */

  public async getAllowedChildTypes(options: LoadOptions<ContentType>): Promise<ODataCollectionResponse<ContentType>> {
    const allowedTypes: ODataCollectionResponse<ContentType> = { d: { __count: 0, results: [] } }
    let implicitACTs: ODataCollectionResponse<ContentType>
    let explicitACTs: ODataCollectionResponse<ContentType>
    await Promise.all([
      (async () => {
        implicitACTs = await this.getImplicitAllowedChildTypes(options)
      })(),
      (async () => {
        explicitACTs = await this.getExplicitAllowedChildTypes(options)
      })(),
    ]).then(() => {
      allowedTypes.d.results = implicitACTs.d
        ? implicitACTs.d.results
            .filter(
              (ct: ContentType) =>
                !explicitACTs.d.results.find((contenttype: ContentType) => ct.Name === contenttype.Name),
            )
            .concat(explicitACTs.d.results)
        : []
      allowedTypes.d.__count = allowedTypes.d.results.length
    })

    return allowedTypes
  }

  /**
   * Retrieves a list of content types the user can create as children below the given content (allowed on the content)
   * @param {LoadOptions<ContentType>} options Options for fetching the AllowedChildTypes
   */
  public async getImplicitAllowedChildTypes(
    options: LoadOptions<ContentType>,
  ): Promise<ODataCollectionResponse<ContentType>> {
    const contextPath = PathHelper.getContentUrl(options.idOrPath)
    const params = ODataUrlBuilder.buildUrlParamString(this.configuration, options.oDataOptions)
    const path = PathHelper.joinPaths(
      this.configuration.repositoryUrl,
      this.configuration.oDataToken,
      contextPath,
      'AllowedChildTypes',
    )
    const response = await this.fetch(`${path}?${params}`, {
      credentials: 'include',
      method: 'GET',
    })
    if (!response.ok) {
      throw await this.getErrorFromResponse(response)
    }
    return await response.json()
  }

  /**
   * Retrieves a list of content types the user can create as children below the given content (allowed in the CTD)
   * @param {LoadOptions<ContentType>} options Options for fetching the AllowedChildTypes
   */
  public async getExplicitAllowedChildTypes(
    options: LoadOptions<ContentType>,
  ): Promise<ODataCollectionResponse<ContentType>> {
    const contextPath = PathHelper.getContentUrl(options.idOrPath)
    const params = ODataUrlBuilder.buildUrlParamString(this.configuration, options.oDataOptions)
    const path = PathHelper.joinPaths(
      this.configuration.repositoryUrl,
      this.configuration.oDataToken,
      contextPath,
      'GetAllowedChildTypesFromCTD',
    )
    const response = await this.fetch(`${path}?${params}`, {
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
  public async getWopiData(idOrPath: string | number): Promise<ODataWopiResponse> {
    return await this.executeAction<{}, ODataWopiResponse>({
      idOrPath,
      method: 'GET',
      name: 'GetWopiData',
      oDataOptions: {
        action: 'edit',
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
          key => (params += `&${key}=${encodeURIComponent((options.body as any)[key])}`),
        )
    }
    const response = await this.fetch(`${path}?${params}`, requestOptions)
    if (!response.ok) {
      throw await this.getErrorFromResponse(response)
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

  constructor(
    config?: Partial<RepositoryConfiguration>,
    private fetchMethod: GlobalFetch['fetch'] = window && window.fetch && window.fetch.bind(window),
    public schemas: SchemaStore = new SchemaStore(),
  ) {
    this.configuration = new RepositoryConfiguration(config)
    this.schemas.setSchemas(this.configuration.schemas)
  }
}
