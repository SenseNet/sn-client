/**
 * @module FieldControls
 */
import { Component } from 'react'
import { ReactClientFieldSetting } from '../ClientFieldSetting'

/**
 * Field control that represents obsolete fieldcontrols.
 */

export class EmptyFieldControl extends Component<ReactClientFieldSetting, {}> {
  /**
   * render
   * @return {ReactElement} markup
   */
  public render() {
    return null
  }
}
