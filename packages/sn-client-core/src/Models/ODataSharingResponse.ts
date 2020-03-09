import { SharingLevel, SharingMode } from './RequestOptions'

/**
 * Generic Class that represents a basic OData Sharing Response structure
 */
export interface ODataSharingResponse {
  Id: string
  Token: string
  Identity: number
  Mode: SharingMode
  Level: SharingLevel
  CreatorId: number
  ShareDate: string
}
