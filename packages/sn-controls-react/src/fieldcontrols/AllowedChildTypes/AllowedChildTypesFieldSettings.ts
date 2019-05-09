/**
 * @module FieldControls
 */
import { Repository } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import { ReactClientFieldSetting } from '../ClientFieldSetting'

/**
 * Interface for ReactAllowedChildTypesFieldSetting properties
 */
export interface ReactAllowedChildTypesFieldSetting<T extends GenericContent, K extends keyof T>
  extends ReactClientFieldSetting<T, K> {
  /**
   * Connected repository
   */
  repository: Repository
  /**
   * Function for rendering an icon by an iconname given as an input prop
   */
  renderIcon: (name: string) => JSX.Element
}
