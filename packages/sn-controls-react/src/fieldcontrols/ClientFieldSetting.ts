/**
 * @module FieldControls
 */
import { Repository } from '@sensenet/client-core'
import { ActionName } from '@sensenet/control-mapper'
import { FieldSetting, GenericContent } from '@sensenet/default-content-types'
import { ReactElement } from 'react'

/**
 * Interface for ClientFieldSetting properties
 */
export interface ReactClientFieldSetting<T = FieldSetting, S = GenericContent> {
  /**
   * Field settings for controls.
   */
  settings: T
  /**
   * Content to used by controls that needs to access the repository.
   */
  content?: S
  /**
   * The value of the field.
   */
  fieldValue?: string
  /**
   * Display mode of the field control
   * @default browse
   */
  actionName?: ActionName
  /**
   * Function for rendering an icon by an iconname given as an input prop
   */
  renderIcon?: (name: string) => ReactElement
  /**
   * Connected repository
   */
  repository?: Repository
  /**
   * On change callback to see when a field value is changed.
   */
  fieldOnChange?: (field: string, value: any) => void

  /**
   * Property for FileName control. Used in new view mostly.
   * @example 'jpg'
   */
  extension?: string

  /**
   * Used in Avatar control. You can specify a path for the content to be uploaded.
   * @example '/Root/Sites/Default_Site/demoavatars'
   */
  uploadFolderPath?: string

  /**
   * Input is cleared when this value changes
   */
  triggerClear?: number
}
