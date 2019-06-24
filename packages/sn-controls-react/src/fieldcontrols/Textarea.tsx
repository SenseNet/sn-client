/**
 * @module FieldControls
 */
import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Radium from 'radium'
import { ReactLongTextFieldSetting } from './field-settings/LongTextFieldSetting'

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
export class Textarea extends Component<ReactLongTextFieldSetting, TextareaState> {
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
      value: this.setValue(this.props.value).toString(),
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
      if (this.props.defaultValue) {
        return this.props.defaultValue
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
    this.props.fieldOnChange(this.props.fieldName, event.target.value)
  }
  /**
   * render
   * @return {ReactElement} markup
   */
  public render() {
    switch (this.props.actionName) {
      case 'edit':
        return (
          <TextField
            onChange={this.handleChange}
            name={this.props.fieldName as string}
            id={this.props.fieldName as string}
            label={this.props.labelText}
            className={this.props.className}
            placeholder={this.props.placeHolderText}
            style={this.props.style}
            value={this.state.value}
            required={this.props.required}
            disabled={this.props.readOnly}
            error={this.props.errorText && this.props.errorText.length > 0 ? true : false}
            multiline={true}
            fullWidth={true}
          />
        )
      case 'new':
        return (
          <TextField
            onChange={this.handleChange}
            name={this.props.fieldName as string}
            id={this.props.fieldName as string}
            label={this.props.labelText}
            className={this.props.className}
            placeholder={this.props.placeHolderText}
            style={this.props.style}
            value={this.state.value}
            required={this.props.required}
            disabled={this.props.readOnly}
            error={this.props.errorText && this.props.errorText.length > 0 ? true : false}
            multiline={true}
            fullWidth={true}
          />
        )
      case 'browse':
        return this.props.value && this.props.value.length > 0 ? (
          <div className={this.props.className}>
            <Typography variant="caption" gutterBottom={true}>
              {this.props.labelText}
            </Typography>
            <Typography variant="body1" gutterBottom={true}>
              {this.props.value}
            </Typography>
          </div>
        ) : null
      default:
        return this.props.value && this.props.value.length > 0 ? (
          <div className={this.props.className}>
            <Typography variant="caption" gutterBottom={true}>
              {this.props.labelText}
            </Typography>
            <Typography variant="body1" gutterBottom={true}>
              {this.props.value}
            </Typography>
          </div>
        ) : null
    }
  }
}
