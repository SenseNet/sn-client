/**
 * Desribes content metadata action information that can be requested on OData
 */
export interface MetadataAction {
  opId: string
  title: string
  name: string
  target: string
  forbidden: boolean
  parameters: Array<{
    name: string
    type: string
    required: boolean
    /** Allowed values when the parameter type is an enum. */
    enumValues?: Array<string | number>
  }>
  isODataAction: boolean
}
