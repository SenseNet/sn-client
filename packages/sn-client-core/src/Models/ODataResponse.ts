import { Metadata } from './Metadata'

/**
 * Generic Class that represents a basic OData Response structure
 */
export interface ODataResponse<T> {
  d: T & { __metadata?: Metadata }
}
