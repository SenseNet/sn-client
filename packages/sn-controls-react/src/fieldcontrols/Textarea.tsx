/**
 * @module FieldControls
 */
import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Radium from 'radium'
import { LongTextFieldSetting } from '@sensenet/default-content-types'
import { ReactClientFieldSetting } from './ClientFieldSetting'

/**
 * Interface for Textarea state
 */
export interface TextareaState {
  value: string
}

// TODO: FIX THIS! this is not working as expected.
/**
 * Field control that represents a LongText field. Available values will be populated from the FieldSettings.
 */
@Radium
export class Textarea extends Component<ReactClientFieldSetting<LongTextFieldSetting>, TextareaState> {
  /**
   * constructor
   * @param {object} props
   */
  constructor(props: Textarea['props']) {
    super(props)
    /**
     * @type {object}
     * @property {string} value input value
     */
    this.state = {
      value: this.setValue(this.props.content[this.props.settings.Name]).toString(),
    }

    this.handleChange = this.handleChange.bind(this)
  }
  /**
   * returns default value of an input
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
   * handle change event on an input
   * @param {SytheticEvent} event
   */
  public handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    this.setState({ value: event.target.value })
    this.props.fieldOnChange && this.props.fieldOnChange(this.props.settings.Name, event.target.value)
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
            onChange={this.handleChange}
            name={this.props.settings.Name}
            id={this.props.settings.Name}
            label={this.props.settings.DisplayName}
            placeholder={this.props.settings.DisplayName}
            value={this.state.value}
            required={this.props.settings.Compulsory}
            disabled={this.props.settings.ReadOnly}
            multiline={true}
            fullWidth={true}
          />
        )
      case 'browse':
      default:
        return this.props.content[this.props.settings.Name] &&
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
