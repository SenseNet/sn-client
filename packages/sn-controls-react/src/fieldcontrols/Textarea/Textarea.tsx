/* eslint-disable dot-notation */
/**
 * @module FieldControls
 */
import React, { Component } from 'react'

import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { GenericContent } from '@sensenet/default-content-types'
import Radium from 'radium'
import { ReactLongTextFieldSetting } from '../LongTextFieldSetting'
import { ReactClientFieldSetting, ReactClientFieldSettingProps } from '../ClientFieldSetting'

/**
 * Interface for Textarea properties
 */
export interface TextareaProps<T extends GenericContent, K extends keyof T>
  extends ReactClientFieldSettingProps<T, K>,
    ReactClientFieldSetting<T, K>,
    ReactLongTextFieldSetting<T, K> {}
/**
 * Interface for Textarea state
 */
export interface TextareaState {
  value: string
}
/**
 * Field control that represents a LongText field. Available values will be populated from the FieldSettings.
 */
@Radium
export class Textarea<T extends GenericContent, K extends keyof T> extends Component<
  TextareaProps<T, K>,
  TextareaState
> {
  /**
   * constructor
   * @param {object} props
   */
  constructor(props: TextareaProps<T, K>) {
    super(props)
    /**
     * @type {object}
     * @property {string} value input value
     */
    this.state = {
      value: this.setValue(this.props['data-fieldValue']).toString(),
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
      if (this.props['defaultValue']) {
        return this.props['defaultValue']
      } else {
        return ''
      }
    }
  }
  /**
   * handle change event on an input
   * @param {SytheticEvent} event
   */
  public handleChange(event: React.ChangeEvent) {
    this.setState({ value: event.target['value'] })
    this.props.onChange(this.props.name, event.target['value'])
  }
  /**
   * render
   * @return {ReactElement} markup
   */
  public render() {
    switch (this.props['actionName']) {
      case 'edit':
        return (
          <TextField
            name={this.props.name as string}
            id={this.props.name as string}
            label={this.props['labelText']}
            className={this.props.className}
            placeholder={this.props['placeHolderText']}
            style={this.props.style}
            value={this.props.value}
            required={this.props.required}
            disabled={this.props.readOnly}
            error={this.props['errorText'] && this.props['errorText'].length > 0 ? true : false}
            multiline={true}
            fullWidth={true}
          />
        )
      case 'new':
        return (
          <TextField
            name={this.props.name as string}
            id={this.props.name as string}
            label={this.props['labelText']}
            className={this.props.className}
            placeholder={this.props['placeHolderText']}
            style={this.props.style}
            defaultValue={this.props['defaultValue'] ? this.props['defaultValue'].toString() : ''}
            required={this.props.required}
            disabled={this.props.readOnly}
            error={this.props['errorText'] && this.props['errorText'].length > 0 ? true : false}
            multiline={true}
            fullWidth={true}
          />
        )
      case 'browse':
        return this.props.value && this.props.value.length > 0 ? (
          <div className={this.props.className}>
            <Typography variant="caption" gutterBottom={true}>
              {this.props['labelText']}
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
              {this.props['labelText']}
            </Typography>
            <Typography variant="body1" gutterBottom={true}>
              {this.props.value}
            </Typography>
          </div>
        ) : null
    }
  }
}
