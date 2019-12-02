/**
 * @module ODataApi
 */

/**
 * Defines an OData field parameter
 */
export type ODataFieldParameter<T> = Array<keyof T>
/**
 * Defines an OData Order parameter
 */
export type ODataOrderParameter<T> = keyof T | Array<keyof T | [keyof T, 'asc' | 'desc']>

/**
 * Defines a metadata type for OData requests
 */
export type ODataMetadataType = 'full' | 'minimal' | 'no'
/**
 * Defines a format type for OData requests
 */
export type ODataFormatType = 'json' | 'verbosejson'

/**
 * Defines an inline count parameter for OData requests
 */
export type ODataInlineCountType = 'none' | 'allpages'

/**
 * Model class to define specific OData Request parameters. See http://wiki.sensenet.com/OData_REST_API
 */
export interface ODataParams<T> {
  /**
   * The field(s) to be include in a $select list. Can be a field (e.g. 'DisplayName'), an array of fields (e.g. ['Name', 'Type']) or 'all'
   */
  select?: ODataFieldParameter<T> | 'all'
  /**
   * The field(s) to be include in an $expand list. Can be a reference field (e.g. 'Owner') or an array of fields (e.g. ['CreatedBy', 'ModifiecBy'])
   */
  expand?: ODataFieldParameter<T>

  /**
   * Sets the OData $orderby parameter. Usage example
   * ```ts
   * // simple field
   * {
   *    ...
   *    orderby: 'Name'
   * }
   * // list with fields or tuples with order direction
   * {
   *    ...
   *    orderby: [
   *      ['CreationDate', 'desc']
   *      'Name',
   *      'DisplayName'
   *    ]
   *
   * }
   *
   * ```
   */
  orderby?: ODataOrderParameter<T>
  /**
   * Sets the OData $top parameter
   */
  top?: number

  /**
   * Sets the OData $skip parameter
   */
  skip?: number

  /**
   * Sets the OData $filter parameter
   */
  filter?: string

  /**
   * Sets the OData $format parameter. Can be 'json' or 'verbosejson'
   */
  format?: ODataFormatType

  /**
   * Sets the OData $format parameter. Can be 'json' or 'verbosejson'
   */
  inlinecount?: ODataInlineCountType

  /**
   * Sets the OData 'query' parameter. Can be a Content Query
   */
  query?: string
  /**
   * Sets the OData metadata parameter. Can be 'full', 'minimal' or 'no'
   */
  metadata?: ODataMetadataType

  /**
   * The scenario parameter that can be used in case of action scenario filtering
   */
  scenario?: string

  /**
   * Defines the content version (e.g. 'V1.0A')
   */
  version?: string
}
