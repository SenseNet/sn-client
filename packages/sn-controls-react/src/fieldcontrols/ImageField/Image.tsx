/**
 * @module FieldControls
 *
 */ /** */
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input/Input'
import InputLabel from '@material-ui/core/InputLabel/InputLabel'
import Typography from '@material-ui/core/Typography'
import { Upload } from '@sensenet/client-core'
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
  container: {
    display: 'flex',
  },
  imageContainer: {
    flexShrink: 0,
    marginTop: 20,
  },
  image: {
    maxWidth: 120,
    maxHeight: 120,
  },
  uploadControl: {
    position: 'relative' as any,
    flexGrow: 2,
    margin: '20px 0 0 20px',
  },
}
/**
 * Interface for Name properties
 */
export interface ImageProps<T extends GenericContent, K extends keyof T>
  extends ReactClientFieldSettingProps<T, K>,
    ReactClientFieldSetting<T, K>,
    ReactBinaryFieldSetting<T, K> {}
/**
 * Interface for Name state
 */
export interface ImageState {
  value: string
  error: string
}
/**
 * Field control that represents a Image field. Available values will be populated from the FieldSettings.
 */
@Radium
export class Image<T extends GenericContent, K extends keyof T> extends Component<ImageProps<T, K>, ImageState> {
  /**
   * constructor
   * @param {object} props
   */
  constructor(props: ImageProps<T, K>) {
    super(props)
    /**
     * @type {object}
     * @property {string} value input value
     */
    this.state = {
      value: this.setValue(this.props['data-fieldValue'].Url).toString() || '',
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
    // tslint:disable-next-line:no-string-literal
    const value = e.target['value']
    this.setState({ value })
    // tslint:disable-next-line:no-string-literal
    onChange(this.props.name['Url'], value)
  }
  /**
   * returns a name from the given path
   */
  public getNameFromPath = (path: string) => path.replace(/^.*[\\\/]/, '')
  /**
   * handles change event on the fileupload input
   */
  public handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (this.props['data-onChange']) {
      this.props['data-onChange']()
    }
    e.persist()
    e.target.files &&
      (await Upload.fromFileList({
        fileList: e.target.files,
        createFolders: true,
        contentTypeName: 'File',
        binaryPropertyName: 'Binary',
        overwrite: true,
        parentPath: this.props['data-uploadFolderPath'] ? this.props['data-uploadFolderPath'] : '',
        repository: this.props['data-repository'],
      }))
    // tslint:disable-next-line:no-string-literal
    const newValue = `${this.props['data-uploadFolderPath']}/${this.getNameFromPath(
      (e.target as HTMLInputElement)['value'],
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
    switch (this.props['data-actionName']) {
      case 'edit':
        return (
          <FormControl
            className={this.props.className}
            style={styles.root as any}
            key={this.props.name as string}
            component={'fieldset' as 'div'}
            required={this.props.required}>
            <label style={styles.label} htmlFor={this.props.name as string}>
              {this.props['data-labelText']}
            </label>
            <div style={styles.container}>
              <div style={styles.imageContainer}>
                <img src={this.props['data-repositoryUrl'] + this.state.value} style={styles.image} />
              </div>
              <div style={styles.uploadControl}>
                <InputLabel htmlFor="raised-button-file" style={{ transform: 'translate(0, 4px) scale(1)' }}>
                  <Button variant="contained" component="span" color="primary">
                    Upload a new image
                  </Button>
                </InputLabel>
              </div>
              <Input
                style={{ display: 'none' }}
                id="raised-button-file"
                type="file"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.handleUpload(e)}
              />
            </div>
          </FormControl>
        )
      case 'new':
        return <div>aaa</div>
      case 'browse':
        return this.props.value && this.props.value.length > 0 ? <div>aaa</div> : null
      default:
        return this.props.value && this.props.value.length > 0 ? (
          <div className={this.props.className}>
            <Typography variant="caption" gutterBottom={true}>
              {this.props['data-labelText']}
            </Typography>
            <Typography variant="body2" gutterBottom={true}>
              {this.props.value}
            </Typography>
          </div>
        ) : null
    }
  }
}
