/* eslint-disable dot-notation */
/**
 * @module FieldControls
 */

import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel/InputLabel'
import Typography from '@material-ui/core/Typography'
import { GenericContent } from '@sensenet/default-content-types'
import Radium from 'radium'
import React, { Component } from 'react'
import { ReactBinaryFieldSetting } from '../BinaryFieldSetting'
import { ReactClientFieldSetting, ReactClientFieldSettingProps } from '../ClientFieldSetting'

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  label: {
    color: 'rgba(0, 0, 0, 0.54)',
    padding: 0,
    fontSize: '12px',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    lineHeight: 1,
  },
  value: {
    fontStyle: 'italic',
    margin: '5px 0',
  },
}

/**
 * Interface for FileUpload properties
 */
export interface FileUploadProps<T extends GenericContent, K extends keyof T>
  extends ReactClientFieldSettingProps<T, K>,
    ReactClientFieldSetting<T, K>,
    ReactBinaryFieldSetting<T, K> {}
/**
 * Interface for FileUpload state
 */
export interface FileUploadState {
  value: string
  error: string
  filename: string
  buttonText: string
}
/**
 * Field control that represents a FileUpload field. Available values will be populated from the FieldSettings.
 */
@Radium
export class FileUpload<T extends GenericContent, K extends keyof T> extends Component<
  FileUploadProps<T, K>,
  FileUploadState
> {
  /**
   * constructor
   * @param {object} props
   */
  constructor(props: FileUploadProps<T, K>) {
    super(props)
    /**
     * @type {object}
     * @property {string} value input value
     */
    this.state = {
      value: this.setValue(this.props['data-fieldValue']).toString(),
      error: '',
      filename: this.props.value || '',
      buttonText: this.props.value ? 'Change' : 'Add',
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleUpload = this.handleUpload.bind(this)
  }
  /**
   * convert incoming default value string to proper format
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
   * Handles input changes. Dispatches a redux action to change field value in the state tree.
   * @param e
   */
  public handleChange(e: React.ChangeEvent<{ value: string }>) {
    const { onChange } = this.props
    const { value } = e.target
    this.setState({ value })
    onChange(this.props.name, value)
  }
  /**
   * Removes the saved reference
   */
  public removeValue = () => {
    this.setState({
      value: '',
      filename: '',
      buttonText: 'Upload',
    })
  }
  /**
   * returns a name from the given path
   */
  public getNameFromPath = (path: string) => path.replace(/^.*[\\/]/, '')
  /**
   * handles change event on the fileupload input
   */
  public handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (this.props['data-onChange']) {
      this.props['data-onChange']()
    }
    e.persist()
    e.target.files &&
      (await this.props['data-repository'].upload.fromFileList({
        fileList: e.target.files,
        createFolders: true,
        binaryPropertyName: 'Binary',
        overwrite: true,
        parentPath: this.props['data-uploadFolderPath'] ? this.props['data-uploadFolderPath'] : '',
      }))
    const newValue = `${this.props['data-uploadFolderPath']}/${this.getNameFromPath(
      (e.target as HTMLInputElement).value,
    )}`
    this.setState({
      value: newValue,
    })
    this.props.onChange('Avatar' as any, newValue as any)
  }
  /**
   * render
   * @return {ReactElement} markup
   */
  public render() {
    switch (this.props['actionName']) {
      case 'edit':
        return (
          <FormControl
            className={this.props.className}
            style={styles.root as any}
            key={this.props.name as string}
            component={'fieldset' as 'div'}
            required={this.props.required}>
            <label style={styles.label} htmlFor={this.props.name as string}>
              {this.props['labelText']}
            </label>
            {this.props['data-innerComponent'] ? (
              this.props['data-innerComponent'](
                this.state.filename,
                `${this.props['data-folderPath']}/${this.state.filename}`,
              )
            ) : (
              <Typography variant="body1" style={styles.value}>
                {this.state.filename.length > 0 ? this.state.filename : this.props['placeHolderText']}
              </Typography>
            )}
            <div style={{ display: 'table-row' }}>
              <div style={{ position: 'relative', display: 'table-cell', minWidth: 100 }}>
                <InputLabel htmlFor="raised-button-file" style={{ transform: 'translate(0, 4px) scale(1)' }}>
                  <Button variant="contained" component="span" color="primary">
                    {this.state.buttonText}
                  </Button>
                </InputLabel>
              </div>
              <div style={{ display: 'table-cell' }}>
                <Button
                  component="span"
                  color="secondary"
                  style={{ transform: 'translate(0, 4px) scale(1)' }}
                  onClick={() => this.removeValue()}>
                  Remove
                </Button>
              </div>
            </div>
            <Input
              style={{ display: 'none' }}
              id="raised-button-file"
              type="file"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.handleUpload(e)}
            />
          </FormControl>
        )
      case 'new':
        return (
          <FormControl
            className={this.props.className}
            style={styles.root as any}
            key={this.props.name as string}
            component={'fieldset' as 'div'}
            required={this.props.required}>
            <label style={styles.label} htmlFor={this.props.name as string}>
              {this.props['labelText']}
            </label>
            <Typography variant="body1" style={styles.value}>
              {this.state.filename.length > 0 ? this.state.filename : this.props['placeHolderText']}
            </Typography>
            <div style={{ position: 'relative' }}>
              <InputLabel htmlFor="raised-button-file" style={{ transform: 'translate(0, 4px) scale(1)' }}>
                <Button variant="contained" component="span" color="primary">
                  Upload
                </Button>
              </InputLabel>
            </div>
            <Input
              style={{ display: 'none' }}
              id="raised-button-file"
              type="file"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.handleUpload(e)}
            />
          </FormControl>
        )
      default:
        return null
    }
  }
}
