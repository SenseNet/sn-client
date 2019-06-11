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
  private static combineODataFieldParameters<T>(...params: Array<ODataFieldParameter<T>>): ODataFieldParameter<T> {
    for (let param of params) {
      if (typeof param === 'string') {
        param = [param]
      }
    }
    params = params.filter(param => param && param.toString().length > 0)
    return [...new Set([].concat.apply([], params as any))] as ODataFieldParameter<T>
  }

  /**
   * Method to build proper parameter string to OData requests based on the given repository configuration and option Object.
   *
   * Checks whether a given parameter is standard OData param or not and based on this information this params get the '$' sign.
   * @param {RepositoryConfiguration} config Represents the current Repository configuration for default select, expand, etc... options
   * @param {IODataOptions} options Represents an ODataOptions obejct based through the IODataOptions interface. Holds the possible url parameters as properties.
   * @returns {string} String with the url params in the correct format e.g. '$select=DisplayName,Index'&$top=2&metadata=no'.
   */
  public static buildUrlParamString<T>(config: RepositoryConfiguration, options?: ODataParams<T>): string {
    if (!options) {
      options = {}
    }

    if (config.requiredSelect === 'all' || config.defaultSelect === 'all' || options.select === 'all') {
      options.select = undefined
    } else {
      options.select = this.combineODataFieldParameters<any>(
        config.requiredSelect,
        options.select || config.defaultSelect,
      ) as any
    }
    options.metadata = options.metadata || config.defaultMetadata
    options.inlinecount = options.inlinecount || config.defaultInlineCount
    options.expand = options.expand || (config.defaultExpand as any)
    options.top = options.top || config.defaultTop

    const segments: Array<{ name: string; value: string }> = []
    for (const key in options) {
      const name = this.ODATA_PARAMS.indexOf(key) > -1 ? `$${key}` : key
      const plainValue = (options as any)[key]
      let parsedValue = plainValue
      if (plainValue instanceof Array && plainValue.length && plainValue.length > 0) {
        parsedValue = plainValue.map(v => (v.join && v.join(' ')) || v).join(',')
      }
      if (name && parsedValue && parsedValue.toString().length) {
        segments.push({ name, value: parsedValue })
      }
    }

    return segments.map(s => `${s.name}=${s.value}`).join('&')
  }
}
