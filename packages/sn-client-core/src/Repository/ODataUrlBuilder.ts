import { GenericContent } from '@sensenet/default-content-types/src'
import { ODataFieldParameter, ODataParams } from '../Models/ODataParams'
import { RepositoryConfiguration } from './RepositoryConfiguration'

/**
 * Helper class to build OData Urls
 */
export class ODataUrlBuilder {
  /**
   * List of a valid OData parameters
   */
  public static readonly ODATA_PARAMS = [
    'select',
    'expand',
    'orderby',
    'top',
    'skip',
    'filter',
    'format',
    'inlinecount',
  ]
  private static combineODataFieldParameters<T>(...params: Array<ODataFieldParameter<T>>) {
    const filtered = params.filter(Boolean)
    const flatten = filtered.reduce((previousValue, currentValue) => previousValue.concat(currentValue), [])
    return [...new Set(flatten)]
  }

  /**
   * Method to build proper parameter string to OData requests based on the given repository configuration and option Object.
   *
   * Checks whether a given parameter is standard OData param or not and based on this information this params get the '$' sign.
   * @param {RepositoryConfiguration} config Represents the current Repository configuration for default select, expand, etc... options
   * @param {ODataParams} options Represents an ODataOptions object. Holds the possible url parameters as properties.
   * @returns {string} String with the url params in the correct format e.g. '$select=DisplayName,Index'&$top=2&metadata=no'.
   */
  public static buildUrlParamString<T = GenericContent>(
    config: RepositoryConfiguration,
    options?: ODataParams<T>,
  ): string {
    const oDataParams: ODataParams<T> = { ...options }

    if (config.requiredSelect === 'all' || config.defaultSelect === 'all' || oDataParams?.select === 'all') {
      oDataParams.select = undefined
    } else {
      oDataParams.select = this.combineODataFieldParameters<T>(
        config.requiredSelect as any,
        oDataParams.select ?? (config.defaultSelect as any),
      )
    }
    oDataParams.metadata = oDataParams.metadata ?? config.defaultMetadata
    oDataParams.inlinecount = oDataParams.inlinecount ?? config.defaultInlineCount
    oDataParams.expand = oDataParams.expand ?? (config.defaultExpand as any)
    oDataParams.top = oDataParams.top ?? config.defaultTop

    const segments: Array<{ name: string; value: string }> = []
    for (const key in oDataParams) {
      const name = this.ODATA_PARAMS.includes(key) ? `$${key}` : key
      const plainValue = (oDataParams as any)[key]
      let parsedValue = plainValue
      if (plainValue instanceof Array && plainValue.length) {
        parsedValue = plainValue.map(v => v.join?.(' ') ?? v).join(',')
      }
      if (name && parsedValue && parsedValue.toString().length) {
        segments.push({ name, value: parsedValue })
      }
    }

    return segments.map(s => `${s.name}=${encodeURIComponent(s.value)}`).join('&')
  }
}
