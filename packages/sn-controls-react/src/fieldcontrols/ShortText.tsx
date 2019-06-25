/**
 * @module FieldControls
 */
import React, { Component } from 'react'

import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { ReactShortTextFieldSetting } from './field-settings/ShortTextFieldSetting'

/**
 * Interface for ShortText properties
 */
export interface ShortTextState {
  value: string
}
/**
 * Field control that represents a ShortText field. Available values will be populated from the FieldSettings.
 */
// @Radium
export class ShortText extends Component<ReactShortTextFieldSetting, ShortTextState> {
  /**
   * constructor
   * @param {object} props
   */
  constructor(props: ShortText['props']) {
    super(props)
    /**
     * @type {object}
     * @property {string} value input value
     */
    this.state = {
      value: this.setValue(this.props.value).toString(),
    }
  }
  /**
   * returns default value of an input
   * @param {string} value
   */
  public setValue(value: string) {
    if (value) {
      return value
    } else {
      if (this.props.defaultValue) {
        return this.props.defaultValue
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
    const { fieldName, fieldOnChange: onChange } = this.props
    const { value } = e.target
    onChange(fieldName, value)
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
            name={this.props.fieldName as string}
            id={this.props.fieldName as string}
            label={
              this.props.errorText && this.props.errorText.length > 0 ? this.props.errorText : this.props.labelText
            }
            className={this.props.className}
            placeholder={this.props.placeHolderText}
            style={this.props.style}
            value={this.props.value}
            required={this.props.required}
            disabled={this.props.readOnly}
            error={this.props.errorText && this.props.errorText.length > 0 ? true : false}
            fullWidth={true}
            onChange={e => this.handleChange(e)}
            helperText={this.props.hintText}
          />
        )
      case 'new':
        return (
          <TextField
            name={this.props.fieldName as string}
            id={this.props.fieldName as string}
            label={
              this.props.errorText && this.props.errorText.length > 0 ? this.props.errorText : this.props.labelText
            }
            className={this.props.className}
            placeholder={this.props.placeHolderText}
            style={this.props.style}
            defaultValue={this.props.defaultValue ? this.props.defaultValue.toString() : ''}
            required={this.props.required}
            disabled={this.props.readOnly}
            error={this.props.errorText && this.props.errorText.length > 0 ? true : false}
            fullWidth={true}
            helperText={this.props.hintText}
            onChange={e => this.handleChange(e)}
          />
        )
      case 'browse':
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
