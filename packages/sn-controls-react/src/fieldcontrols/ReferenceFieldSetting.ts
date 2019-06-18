/**
 * @module FieldControls
 */
import { GenericContent } from '@sensenet/default-content-types'
import { ReactClientFieldSetting } from './ClientFieldSetting'

/**
 * Interface for ReferenceFieldSetting properties
 */
export interface ReactReferenceFieldSetting<T extends GenericContent = GenericContent, K extends keyof T = 'Name'>
  extends ReactClientFieldSetting<T, K> {
  /**
   * Defines whether multiple references are allowed or only a single content can be referenced
   * @default false
   */
  allowMultiple?: boolean
  /**
   * Allowed content types can be defined by explicitely listing type names in Type elements
   * @default all
   */
  allowedTypes?: string[]
  /**
   * Allowed location of referable content can be defined by listing paths in Path elements
   * @default /Root
   */
  selectionRoot?: string[]
  /**
   * Default name of content items displayed in a reference field
   */
  defaultDisplayName?: string
  /**
   * Datasource of a reference field with the optional items that can be chosen
   */
  dataSource: any[]
  /**
   * Current content
   */
  content?: GenericContent
}
