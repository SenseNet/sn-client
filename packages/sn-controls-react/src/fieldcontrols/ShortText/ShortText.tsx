/**
 * @module FieldControls
 */
import React, { Component } from 'react'

import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { GenericContent } from '@sensenet/default-content-types'
import Radium from 'radium'
import { ReactClientFieldSetting, ReactClientFieldSettingProps } from '../ClientFieldSetting'
import { ReactShortTextFieldSetting } from './ShortTextFieldSetting'

/**
 * Interface for ShortText properties
 */
export interface ShortTextProps<T extends GenericContent, K extends keyof T>
  extends ReactClientFieldSettingProps<T, K>,
    ReactClientFieldSetting<T, K>,
    ReactShortTextFieldSetting<T, K> {}
/**
 * Interface for ShortText properties
 */
export interface ShortTextState {
  value: string
}
/**
 * Field control that represents a ShortText field. Available values will be populated from the FieldSettings.
 */
@Radium
export class ShortText<T extends GenericContent, K extends keyof T> extends Component<
  ShortTextProps<T, K>,
  ShortTextState
> {
  /**
   * constructor
   * @param {object} props
   */
  constructor(props: ShortTextProps<T, K>) {
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
    const { name, onChange } = this.props
    const { value } = e.target
    onChange(name, value)
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
            name={this.props.name as string}
            id={this.props.name as string}
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
            name={this.props.name as string}
            id={this.props.name as string}
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
