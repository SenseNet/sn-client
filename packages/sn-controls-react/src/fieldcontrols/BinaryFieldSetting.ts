/**
 * @module FieldControls
 */
import { ReactClientFieldSetting } from './ClientFieldSetting'

/**
 * Interface for BinaryFieldSetting properties
 */
export interface ReactBinaryFieldSetting extends ReactClientFieldSetting {
  /**
   * Path of the folder where the file will be uploaded.
   */
  uploadFolderPath?: string
}
