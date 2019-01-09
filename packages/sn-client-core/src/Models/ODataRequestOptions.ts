/**
 * @module ODataApi
 */

import { ODataParams } from './ODataParams'

/**
 * Defines an options model for OData requests
 */
export interface ODataRequestOptions<T> {
  path: string
  params?: ODataParams<T>
  async?: boolean
  type?: string
  success?: () => void
  error?: () => void
  complete?: () => void
}
