/**
 * @module FieldControls
 */
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormLabel from '@material-ui/core/FormLabel'
import Typography from '@material-ui/core/Typography'
import Radium from 'radium'
import React, { Component } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { ReactClientFieldSetting } from './field-settings/ClientFieldSetting'

/**
 * Interface for RichTextEditor state
 */
export interface RichTextEditorState {
  value: string
}

const modules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
    ['blockquote', 'code-block'],

    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
    [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
    [{ direction: 'rtl' }], // text direction

    [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],

    ['clean'], // remove formatting button
  ],
}

const formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'video',
]

/**
 * Field control that represents a LongText field. Available values will be populated from the FieldSettings.
 */
@Radium
export class RichTextEditor extends Component<ReactClientFieldSetting, RichTextEditorState> {
  /**
   * constructor
   * @param {object} props
   */
  constructor(props: RichTextEditor['props']) {
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
   * handle change event on an input
   * @param {SytheticEvent} event
   */
  public handleChange(value: string) {
    this.setState({ value })
    this.props.fieldOnChange(this.props.fieldName, value as any)
  }
  /**
   * render
   * @return {ReactElement} markup
   */
  public render() {
    switch (this.props.actionName) {
      case 'edit':
        return (
          <FormControl
            component={'fieldset' as 'div'}
            fullWidth={true}
            error={this.props.errorText && this.props.errorText.length > 0 ? true : false}
            required={this.props.required}
            className={this.props.className}>
            <FormLabel component={'legend' as 'label'}>{this.props.labelText}</FormLabel>
            <ReactQuill
              className={this.props.className}
              style={{ ...this.props.style, ...{ background: '#fff', marginTop: 10 } }}
              value={this.state.value}
              readOnly={this.props.readOnly}
              modules={modules}
              formats={formats}
              onChange={this.handleChange}
              theme="snow"
            />
            <FormHelperText>{this.props.hintText}</FormHelperText>
            <FormHelperText>{this.props.errorText}</FormHelperText>
          </FormControl>
        )
      case 'new':
        return (
          <FormControl
            component={'fieldset' as 'div'}
            fullWidth={true}
            error={this.props.errorText && this.props.errorText.length > 0 ? true : false}
            required={this.props.required}
            className={this.props.className}>
            <FormLabel component={'legend' as 'label'}>{this.props.labelText}</FormLabel>
            <ReactQuill
              className={this.props.className}
              style={{ ...this.props.style, ...{ background: '#fff', marginTop: 10 } }}
              defaultValue={(this.props.defaultValue as unknown) as string}
              readOnly={this.props.readOnly}
              modules={modules}
              formats={formats}
              onChange={this.handleChange}
              theme="snow"
            />
            <FormHelperText>{this.props.hintText}</FormHelperText>
            <FormHelperText>{this.props.errorText}</FormHelperText>
          </FormControl>
        )
      case 'browse':
        return this.props.value && this.props.value.length > 0 ? (
          <div className={this.props.className}>
            <Typography variant="caption" gutterBottom={true}>
              {this.props.labelText}
            </Typography>
            <Typography variant="body1" gutterBottom={true}>
              <div dangerouslySetInnerHTML={{ __html: this.props.value }} />
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
              <div dangerouslySetInnerHTML={{ __html: this.props.value }} />
            </Typography>
          </div>
        ) : null
    }
  }
}
