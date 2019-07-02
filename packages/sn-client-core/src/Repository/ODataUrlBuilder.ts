import { ODataParams } from '../Models/ODataParams'
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
  public static combineODataFieldParameters<T>(...params: any[]) {
    // eslint-disable-next-line prefer-spread
    return [...new Set([].concat.apply([], params))] as Array<keyof T>
  }

  public static combineSelect<T>(config: RepositoryConfiguration, options?: ODataParams<T>) {
    return this.combineODataFieldParameters<T>(
      config.requiredSelect,
      (options && options.select) || config.defaultSelect,
    )
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

    const select = this.combineSelect<T>(config, options)
    options.select = select.length ? select : undefined
    options.metadata = options.metadata || config.defaultMetadata
    options.inlinecount = options.inlinecount || config.defaultInlineCount
    options.expand = options.expand || (config.defaultExpand as Array<keyof T>)
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
