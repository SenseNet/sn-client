/* eslint-disable dot-notation */
/**
 * @module FieldControls
 */
import React, { Component } from 'react'

import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { GenericContent } from '@sensenet/default-content-types'
import Radium from 'radium'
import { ReactShortTextFieldSetting } from '../ShortText/ShortTextFieldSetting'
import { ReactClientFieldSetting, ReactClientFieldSettingProps } from '../ClientFieldSetting'
import { ReactNameFieldSetting } from './NameFieldSetting'

/**
 * Interface for Name properties
 */
export interface NameProps<T extends GenericContent, K extends keyof T>
  extends ReactClientFieldSettingProps<T, K>,
    ReactClientFieldSetting<T, K>,
    ReactShortTextFieldSetting<T, K>,
    ReactNameFieldSetting<T, K> {}
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
@Radium
export class Name<T extends GenericContent, K extends keyof T> extends Component<NameProps<T, K>, NameState> {
  /**
   * constructor
   * @param {object} props
   */
  constructor(props: NameProps<T, K>) {
    super(props)
    /**
     * @type {object}
     * @property {string} value input value
     */
    this.state = {
      value: this.setValue(this.props['data-fieldValue']).toString(),
      isValid: this.props.required ? false : true,
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
      if (this.props['data-defaultValue']) {
        return this.props['data-defaultValue']
      } else {
        return ''
      }
    }
  }
  /**
   * Handles input changes. Dispatches a redux action to change field value in the state tree.
   * @param e
   */
  public handleChange(e: React.ChangeEvent) {
    const { onChange } = this.props
    const value = e.target['value']
    this.setState({ value })
    onChange(this.props.name, value)
  }
  /**
   * render
   * @return {ReactElement} markup
   */
  public render() {
    switch (this.props['data-actionName']) {
      case 'edit':
        return (
          <TextField
            name={this.props.name as string}
            id={this.props.name as string}
            label={
              this.props['data-errorText'] && this.props['data-errorText'].length > 0
                ? this.props['data-errorText']
                : this.props['data-labelText']
            }
            className={this.props.className}
            placeholder={this.props['data-placeHolderText']}
            style={this.props.style}
            value={this.props.value}
            required={this.props.required}
            disabled={this.props.readOnly}
            error={this.props['data-errorText'] && this.props['data-errorText'].length > 0 ? true : false}
            fullWidth={true}
            onChange={e => this.handleChange(e)}
            helperText={this.props['data-hintText']}
          />
        )
      case 'new':
        return (
          <TextField
            name={this.props.name as string}
            id={this.props.name as string}
            label={
              this.props['data-errorText'] && this.props['data-errorText'].length > 0
                ? this.props['data-errorText']
                : this.props['data-labelText']
            }
            className={this.props.className}
            placeholder={this.props['data-placeHolderText']}
            style={this.props.style}
            defaultValue={this.props['data-defaultValue'] ? this.props['data-defaultValue'].toString() : ''}
            required={this.props.required}
            disabled={this.props.readOnly}
            error={this.props['data-errorText'] && this.props['data-errorText'].length > 0 ? true : false}
            fullWidth={true}
            helperText={this.props['data-hintText']}
          />
        )
      case 'browse':
        return this.props.value && this.props.value.length > 0 ? (
          <div className={this.props.className}>
            <Typography variant="caption" gutterBottom={true}>
              {this.props['data-labelText']}
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
              {this.props['data-labelText']}
            </Typography>
            <Typography variant="body1" gutterBottom={true}>
              {this.props.value}
            </Typography>
          </div>
        ) : null
    }
  }
}
