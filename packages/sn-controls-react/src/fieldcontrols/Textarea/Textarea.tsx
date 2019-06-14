/* eslint-disable dot-notation */
/**
 * @module FieldControls
 */
import React, { Component } from 'react'

import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { GenericContent } from '@sensenet/default-content-types'
import { ReactClientFieldSettingProps, ReactClientFieldSetting } from '../ClientFieldSetting'

/**
 * Interface for Textarea properties
 */
export interface TextareaProps<T extends GenericContent, K extends keyof T>
  extends ReactClientFieldSettingProps<T, K>,
    ReactClientFieldSetting<T, K> {}
/**
 * Interface for Textarea state
 */
export interface TextareaState {
  value: string
}
/**
 * Field control that represents a LongText field. Available values will be populated from the FieldSettings.
 */
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
      value: this.props['data-fieldValue']
        ? this.props['data-fieldValue'].replace(/<[^>]*>/g, '')
        : this.props['data-defaultValue']
        ? this.props['data-defaultValue']
        : '',
    }

    this.handleChange = this.handleChange.bind(this)
  }
  /**
   * handle change event on an input
   * @param {SytheticEvent} event
   */
  public handleChange(e: React.ChangeEvent) {
    const newValue = (e.target as HTMLInputElement).value
    this.setState({ value: newValue })
    this.props.onChange(this.props.name, newValue as any)
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
            label={this.props['data-labelText']}
            className={this.props.className}
            placeholder={this.props['data-placeHolderText']}
            style={this.props.style}
            value={this.props.value}
            required={this.props.required}
            disabled={this.props.readOnly}
            error={this.props['data-errorText'] && this.props['data-errorText'].length > 0 ? true : false}
            multiline={true}
            onChange={this.handleChange}
            fullWidth={true}
          />
        )
      case 'new':
        return (
          <TextField
            name={this.props.name as string}
            id={this.props.name as string}
            label={this.props['data-labelText']}
            className={this.props.className}
            placeholder={this.props['data-placeHolderText']}
            style={this.props.style}
            defaultValue={this.props['data-defaultValue'] ? (this.props['data-defaultValue'] as any).toString() : ''}
            required={this.props.required}
            disabled={this.props.readOnly}
            error={this.props['data-errorText'] && this.props['data-errorText'].length > 0 ? true : false}
            multiline={true}
            fullWidth={true}
            onChange={this.handleChange}
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
