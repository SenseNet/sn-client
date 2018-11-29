import { MetadataAction } from './MetadataAction'

/**
 * Desribes content metadata information that can be requested on OData
 */
export interface Metadata {
  uri?: string
  type: string
  actions: MetadataAction[]
  functions: MetadataAction[]
}
