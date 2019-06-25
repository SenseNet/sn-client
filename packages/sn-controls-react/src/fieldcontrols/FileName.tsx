/**
 * @module FieldControls
 */
import React, { Component } from 'react'
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { ReactClientFieldSetting } from './ClientFieldSetting'

/**
 * Interface for FileName state
 */
export interface FileNameState {
  value: string
  isValid: boolean
  error: string
  extension: string
}
/**
 * Field control that represents a ShortText field. Available values will be populated from the FieldSettings.
 */
export class FileName extends Component<ReactClientFieldSetting, FileNameState> {
  /**
   * constructor
   * @param {object} props
   */
  constructor(props: FileName['props']) {
    super(props)
    /**
     * @type {object}
     * @property {string} value input value
     */
    this.state = {
      value: this.setValue(this.props.content[this.props.settings.Name]).toString(),
      isValid: this.props.settings.Compulsory ? false : true,
      error: '',
      //REVIEW THIS
      // extension: this.props.extension
      //   ? this.props.extension
      //   : this.props.content
      //   ? this.getExtensionFromValue(this.props.content.Name)
      //   : this.props.content[this.props.settings.Name] && this.props.content[this.props.settings.Name].indexOf('.') > -1
      //   ? this.getExtensionFromValue(this.props.content[this.props.settings.Name])
      //   : '',
      extension: '',
    }

    this.handleChange = this.handleChange.bind(this)
  }
  /**
   * convert incoming default value string to proper format
   * @param {string} value
   */
  public setValue(value: string) {
    if (value) {
      return value
        .replace(/<[^>]*>/g, '')
        .split('.')
        .slice(0, -1)
        .join('.')
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
  public handleChange(e: React.ChangeEvent) {
    // eslint-disable-next-line dot-notation
    const value = `${e.target['value']}.${this.state.extension}`
    this.props.fieldOnChange && this.props.fieldOnChange(this.props.settings.Name, value)
  }

  /**
   * Returns an extension from a file name
   */
  public getExtensionFromValue = (filename: string) => {
    return filename.substr(filename.lastIndexOf('.') + 1)
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
            name={this.props.settings.Name as string}
            id={this.props.settings.Name as string}
            label={this.props.settings.DisplayName}
            placeholder={this.props.settings.DisplayName}
            defaultValue={this.state.value}
            onChange={e => this.handleChange(e)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <span>{`.${this.state.extension}`}</span>
                </InputAdornment>
              ),
            }}
            autoFocus={true}
            required={this.props.settings.Compulsory}
            disabled={this.props.settings.ReadOnly}
            fullWidth={true}
            helperText={this.props.settings.Description}
          />
        )
      case 'new':
        return (
          <TextField
            name={this.props.settings.Name as string}
            id={this.props.settings.Name as string}
            label={this.props.settings.DisplayName}
            placeholder={this.props.settings.DisplayName}
            defaultValue={this.state.value}
            onChange={e => this.handleChange(e)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <span>{`.${this.state.extension}`}</span>
                </InputAdornment>
              ),
            }}
            autoFocus={true}
            required={this.props.settings.Compulsory}
            disabled={this.props.settings.ReadOnly}
            fullWidth={true}
            helperText={this.props.settings.Description}
          />
        )
      case 'browse':
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
