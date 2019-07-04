/**
 * @module FieldControls
 */
import { Repository } from '@sensenet/client-core'
import { FieldSetting, GenericContent } from '@sensenet/default-content-types'
import { ActionName } from '@sensenet/control-mapper'
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
   * Content to get field values from.
   */
  content?: S
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
}
