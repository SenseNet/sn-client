/**
 * @module FieldControls
 */
import React, { Component } from 'react'
import { ReactClientFieldSetting } from './ClientFieldSetting'
import { ShortText } from '.'

/**
 * Interface for DisplayName state
 */
export interface DisplayNameState {
  value: string
}
/**
 * Field control that represents a ShortText field. Available values will be populated from the FieldSettings.
 */
export class DisplayName extends Component<ReactClientFieldSetting, DisplayNameState> {
  state = {
    value: this.setValue(this.props.content[this.props.settings.Name]),
  }
  /**
   * convert incoming default value string to proper format
   * @param {string} value
   */
  public setValue(value: string) {
    if (value) {
      return value.replace(/<[^>]*>/g, '')
    } else {
      if (this.props.settings.DefaultValue) {
        return this.props.settings.DefaultValue
      } else {
        return ''
      }
    }
  }

  public render() {
    return <ShortText {...this.props} />
  }
}
