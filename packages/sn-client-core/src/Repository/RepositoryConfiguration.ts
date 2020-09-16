import { AllFieldNames, Schema, SchemaStore } from '@sensenet/default-content-types'
import { ODataMetadataType } from '../Models/ODataParams'

/**
 * The default Sense/Net OData Service token (odata.svc)
 */
export const DEFAULT_SERVICE_TOKEN = 'odata.svc'

type AllPossibleFieldNamesWithAll = AllFieldNames[] | string[] | 'all'

/**
 * Interface for sensenet Repository configuration
 */
export interface RepositoryConfiguration {
  /**
   * Chunk size for chunked uploads, must be equal to BinaryChunkSize setting at the backend (default:10485760) // 10 mb
   */
  chunkSize?: number

  /**
   * This field sets up a default OData enableautofilters parameter
   */
  defaultEnableAutofilters?: boolean

  /**
   * This field sets up a default OData enablelifespan parameter
   */
  defaultEnableLifespanfilter?: boolean

  /**
   * This field describes what fields should be expanded on every OData request by default
   */
  defaultExpand?: AllFieldNames[] | string[]

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
  defaultSelect?: AllPossibleFieldNamesWithAll

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
  requiredSelect?: AllPossibleFieldNamesWithAll

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
 * Repository configuration with defaults that are not undefined.
 * token, defaultExpand properties doesn't have a default value. They are undefined.
 */
export type RepositoryConfigurationWithDefaults = Required<Omit<RepositoryConfiguration, 'token' | 'defaultExpand'>> &
  Pick<RepositoryConfiguration, 'token' | 'defaultExpand'>

export const defaultRepositoryConfiguration: RepositoryConfigurationWithDefaults = {
  chunkSize: 500000,
  defaultEnableAutofilters: false,
  defaultEnableLifespanfilter: false,
  defaultInlineCount: 'allpages',
  defaultMetadata: 'no',
  defaultSelect: ['DisplayName', 'Description', 'Icon'],
  defaultTop: 10000,
  oDataToken: DEFAULT_SERVICE_TOKEN,
  repositoryUrl: '',
  requiredSelect: ['Id', 'Path', 'Name', 'Type'],
  schemas: SchemaStore,
}
