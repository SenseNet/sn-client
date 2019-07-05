/**
 * @module FieldControls
 */
import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { LongTextFieldSetting } from '@sensenet/default-content-types'
import { ReactClientFieldSetting } from './ClientFieldSetting'

/**
 * Interface for Textarea state
 */
export interface TextareaState {
  value: string
}

/**
 * Field control that represents a LongText field. Available values will be populated from the FieldSettings.
 */
export class Textarea extends Component<ReactClientFieldSetting<LongTextFieldSetting>, TextareaState> {
  state = {
    value:
      (this.props.fieldValue && this.props.fieldValue.replace(/<[^>]*>/g, '')) ||
      this.props.settings.DefaultValue ||
      '',
  }
  /**
   * handle change event on an input
   * @param {SytheticEvent} event
   */
  public handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    this.setState({ value: event.target.value })
    this.props.fieldOnChange && this.props.fieldOnChange(this.props.settings.Name, event.target.value)
  }

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
        return this.props.fieldValue ? (
          <div>
            <Typography variant="caption" gutterBottom={true}>
              {this.props.settings.DisplayName}
            </Typography>
            <Typography variant="body1" gutterBottom={true}>
              {this.props.fieldValue}
            </Typography>
          </div>
        ) : null
    }
  }
}
