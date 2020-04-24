import { ContentType } from '@sensenet/default-content-types'
import { PathHelper } from '@sensenet/client-utils'
import { LoadOptions, ODataCollectionResponse } from '../Models'
import { Repository } from './Repository'
import { ODataUrlBuilder } from './ODataUrlBuilder'

export class AllowedChildTypes {
  public add(idOrPath: number | string, contentTypes: string[]) {
    return this.repository.executeAction({
      idOrPath,
      name: 'AddAllowedChildTypes',
      method: 'POST',
      body: {
        contentTypes,
      },
    })
  }

  public update(idOrPath: number | string, contentTypes: string[]) {
    return this.repository.patch({
      idOrPath,
      content: {
        AllowedChildTypes: contentTypes,
      } as any,
    })
  }

  public remove(idOrPath: number | string, contentTypes: string[]) {
    return this.repository.executeAction({
      idOrPath,
      name: 'RemoveAllowedChildTypes',
      method: 'POST',
      body: {
        contentTypes,
      },
    })
  }

  public getFromCTD(idOrPath: number | string): Promise<ODataCollectionResponse<ContentType>> {
    return this.repository.executeAction({
      idOrPath,
      name: 'GetAllowedChildTypesFromCTD',
      method: 'GET',
      body: {
        select: ['Name', 'DisplayName', 'Icon'],
      },
    })
  }

  public listEmpty(idOrPath: number | string) {
    return this.repository.executeAction({
      idOrPath,
      name: 'CheckAllowedChildTypesOfFolders',
      method: 'GET',
    })
  }

  /**
   * Retrieves an aggregated list of content types the user can create as children below the given content
   * @param {LoadOptions<ContentType>} options
   */
  public async get(options: LoadOptions<ContentType>): Promise<ODataCollectionResponse<ContentType>> {
    const allowedTypes: ODataCollectionResponse<ContentType> = { d: { __count: 0, results: [] } }

    await Promise.all([this.getImplicit(options), this.getExplicit(options)]).then(
      ([implicitACTs, explicitACTs]: Array<ODataCollectionResponse<ContentType>>) => {
        allowedTypes.d.results = implicitACTs.d
          ? implicitACTs.d.results
              .filter(
                (ct: ContentType) =>
                  !explicitACTs.d.results.find((contenttype: ContentType) => ct.Name === contenttype.Name),
              )
              .concat(explicitACTs.d.results)
          : []
        allowedTypes.d.__count = allowedTypes.d.results.length
      },
    )

    return allowedTypes
  }

  /**
   * Retrieves a list of content types the user can create as children below the given content (allowed on the content)
   * @param {LoadOptions<ContentType>} options Options for fetching the AllowedChildTypes
   */
  public async getImplicit(options: LoadOptions<ContentType>): Promise<ODataCollectionResponse<ContentType>> {
    const contextPath = PathHelper.getContentUrl(options.idOrPath)
    const params = ODataUrlBuilder.buildUrlParamString(this.repository.configuration, options.oDataOptions)
    const path = PathHelper.joinPaths(
      this.repository.configuration.repositoryUrl,
      this.repository.configuration.oDataToken,
      contextPath,
      'AllowedChildTypes',
    )
    const response = await this.repository.fetch(`${path}?${params}`, {
      credentials: 'include',
      method: 'GET',
    })
    if (!response.ok) {
      throw await this.repository.getErrorFromResponse(response)
    }
    return await response.json()
  }

  /**
   * Retrieves a list of content types the user can create as children below the given content (allowed in the CTD)
   * @param {LoadOptions<ContentType>} options Options for fetching the AllowedChildTypes
   */
  public async getExplicit(options: LoadOptions<ContentType>): Promise<ODataCollectionResponse<ContentType>> {
    const contextPath = PathHelper.getContentUrl(options.idOrPath)
    const params = ODataUrlBuilder.buildUrlParamString(this.repository.configuration, options.oDataOptions)
    const path = PathHelper.joinPaths(
      this.repository.configuration.repositoryUrl,
      this.repository.configuration.oDataToken,
      contextPath,
      'EffectiveAllowedChildTypes',
    )
    const response = await this.repository.fetch(`${path}?${params}`, {
      credentials: 'include',
      method: 'GET',
    })
    if (!response.ok) {
      throw await this.repository.getErrorFromResponse(response)
    }
    return await response.json()
  }

  constructor(private readonly repository: Repository) {}
}
