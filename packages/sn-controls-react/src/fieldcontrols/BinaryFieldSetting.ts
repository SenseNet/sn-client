/**
 * @module FieldControls
 *
 */ /** */
import { GenericContent } from '@sensenet/default-content-types'
import { ReactClientFieldSetting } from './ClientFieldSetting'

/**
 * Interface for ShortTextFieldSetting properties
 */
export interface ReactBinaryFieldSetting<T extends GenericContent = GenericContent, K extends keyof T = 'Name'>
  extends ReactClientFieldSetting<T, K> {
  /**
   * Path of the folder where the file should be uploaded
   */
  'data-onChange'?: () => void
  'data-folderPath'?: string
  'data-onUploadSuccess'?: (filename: string, path: string) => void
  'data-innerComponent'?: (filename: string, path: string) => React.Component
}
