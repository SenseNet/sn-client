import { GenericContent, Schema, SchemaStore } from '@sensenet/default-content-types'
import { ODataFieldParameter, ODataMetadataType } from '../Models/ODataParams'

/**
 * The default Sense/Net OData Service token (odata.svc)
 */
const DEFAULT_SERVICE_TOKEN = 'odata.svc'

type GenericContentODataFieldParameterWithAll = ODataFieldParameter<GenericContent> | 'all'

/**
 * Class that contains basic configuration for a sensenet Repository
 */
export interface RepositoryConfiguration {
  /**
   * Chunk size for chunked uploads, must be equal to BinaryChunkSize setting at the backend (default:10485760) // 10 mb
   */
  chunkSize?: number

  /**
   * This field describes what fields should be expanded on every OData request by default
   */
  defaultExpand?: ODataFieldParameter<GenericContent>

  /**
   * This field sets the default OData inline count value (default:'allpages')
   */
  defaultInlineCount?: 'allpages' | 'none'

  /**
   * This field sets the default OData $metadata value (default:'no')
   */
  defaultMetadata?: ODataMetadataType

  /**
   * This parameter describes what fields should be included in the OData $select statements by default (default:['DisplayName', 'Description', 'Icon'])
   */
  defaultSelect?: GenericContentODataFieldParameterWithAll

  /**
   * This field sets up a default OData $top parameter (default:10000)
   */
  defaultTop?: number

  /**
   * The service token for the OData Endpoint (default:'odata.svc')
   */
  oDataToken?: string

  /**
   * The root URL for the Sense/Net repository (e.g.: demo.sensenet.com) (default:'')
   */
  repositoryUrl?: string

  /**
   * This parameter describes what fields should always be included in the OData $select statements (default:['Id', 'Path', 'Name', 'Type'])
   */
  requiredSelect?: GenericContentODataFieldParameterWithAll

  /**
   * An array of schemas
   */
  schemas?: Schema[]

  /**
   * Access token to authorize access to data
   */
  token?: string
}

/**
 * Reposiotry configuration with defaults that are not undefined.
 * token, defaultExpand properties doesn't have a default value. They are undefined.
 */
export type RepositoryConfigurationWithDefaults = Required<Omit<RepositoryConfiguration, 'token' | 'defaultExpand'>> &
  Pick<RepositoryConfiguration, 'token' | 'defaultExpand'>

const defaultRepositoryConfiguration: RepositoryConfigurationWithDefaults = {
  chunkSize: 10485760,
  defaultInlineCount: 'allpages',
  defaultMetadata: 'no',
  defaultSelect: ['DisplayName', 'Description', 'Icon'],
  defaultTop: 10000,
  oDataToken: DEFAULT_SERVICE_TOKEN,
  repositoryUrl: '',
  requiredSelect: ['Id', 'Path', 'Name', 'Type'],
  schemas: SchemaStore,
}

export { defaultRepositoryConfiguration }
