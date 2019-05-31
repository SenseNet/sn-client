import { GenericContent, Schema, SchemaStore } from '@sensenet/default-content-types'
import { ODataFieldParameter, ODataMetadataType } from '../Models/ODataParams'

/**
 * Class that contains basic configuration for a sensenet Repository
 */
export class RepositoryConfiguration {
  /**
   * A reference to the global window instance
   */
  public static windowInstance?: Window = typeof window === 'undefined' ? undefined : window

  /**
   * The default base URL, returns window.location if available
   */
  public static get DEFAULT_BASE_URL(): string {
    return (this.windowInstance && this.windowInstance.location && this.windowInstance.location.origin) || ''
  }

  /**
   * The default Sense/Net OData Service token (odata.svc)
   */
  public static readonly DEFAULT_SERVICE_TOKEN: string = 'odata.svc'

  /**
   * The root URL for the Sense/Net repository (e.g.: demo.sensenet.com)
   */
  public repositoryUrl: string = RepositoryConfiguration.DEFAULT_BASE_URL

  /**
   * The service token for the OData Endpoint
   */
  public oDataToken: string = RepositoryConfiguration.DEFAULT_SERVICE_TOKEN

  /**
   * This string describes how long the user sessions should be persisted.
   */
  public sessionLifetime: 'session' | 'expiration' = 'session'

  /**
   * This parameter describes what fields should be included in the OData $select statements by default
   */
  public defaultSelect: ODataFieldParameter<GenericContent> | 'all' = ['DisplayName', 'Description', 'Icon']

  /**
   * This parameter describes what fields should always be included in the OData $select statements
   */
  public requiredSelect: ODataFieldParameter<GenericContent> | 'all' = ['Id', 'Path', 'Name', 'Type']

  /**
   * This field sets the default OData $metadata value
   */
  public defaultMetadata: ODataMetadataType = 'no'

  /**
   * This field sets the default OData inline count value
   */
  public defaultInlineCount: 'allpages' | 'none' = 'allpages'

  /**
   * This field describes what fields should be expanded on every OData request by default
   */
  public defaultExpand: ODataFieldParameter<GenericContent> | undefined = undefined

  /**
   * This field sets up a default OData $top parameter
   */
  public defaultTop: number = 10000

  /**
   * Chunk size for chunked uploads, must be equal to BinaryChunkSize setting at the backend
   */
  public chunkSize: number = 10485760 // 10 mb

  /**
   * An array of schemas
   */
  public schemas: Schema[] = SchemaStore.map(s => s)

  constructor(config?: Partial<RepositoryConfiguration>) {
    config && Object.assign(this, config)
  }
}
