/**
 * @module FieldControls
 */
import React, { Component } from 'react'

import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { ReactClientFieldSetting } from './ClientFieldSetting'

/**
 * Interface for Name state
 */
export interface NameState {
  value: string
  isValid: boolean
  error: string
}
/**
 * Field control that represents a ShortText field. Available values will be populated from the FieldSettings.
 */
export class Name extends Component<ReactClientFieldSetting, NameState> {
  constructor(props: Name['props']) {
    super(props)
    /**
     * @type {object}
     * @property {string} value input value
     */
    this.state = {
      value: (this.props.content && this.setValue(this.props.content[this.props.settings.Name])) || '',
      isValid: this.props.settings.Compulsory ? false : true,
      error: '',
    }

    this.handleChange = this.handleChange.bind(this)
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
  /**
   * Handles input changes. Dispatches a redux action to change field value in the state tree.
   * @param e
   */
  public handleChange(e: React.ChangeEvent<{ value: string }>) {
    const { value } = e.target
    this.setState({ value })
    this.props.fieldOnChange && this.props.fieldOnChange(this.props.settings.Name, value)
  }
  /**
   * render
   * @return {ReactElement} markup
   */
  public render() {
    switch (this.props.actionName) {
      case 'edit':
      case 'new':
        return (
          <TextField
            name={this.props.settings.Name}
            id={this.props.settings.Name}
            label={this.props.settings.DisplayName}
            placeholder={this.props.settings.DisplayName}
            value={this.state.value}
            required={this.props.settings.Compulsory}
            disabled={this.props.settings.ReadOnly}
            fullWidth={true}
            onChange={this.handleChange}
            helperText={this.props.settings.Description}
          />
        )
      case 'browse':
      default:
        return this.props.content &&
          this.props.content[this.props.settings.Name] &&
          this.props.content[this.props.settings.Name].length > 0 ? (
          <div>
            <Typography variant="caption" gutterBottom={true}>
              {this.props.settings.DisplayName}
            </Typography>
            <Typography variant="body1" gutterBottom={true}>
              {this.props.content[this.props.settings.Name]}
            </Typography>
          </div>
        ) : null
    }
  }
}
