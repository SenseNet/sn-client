/**
 * @module FieldControls
 */
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormLabel from '@material-ui/core/FormLabel'
import Typography from '@material-ui/core/Typography'
import React, { Component } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { ReactClientFieldSetting } from './ClientFieldSetting'

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

/**
 * Field control that represents a LongText field. Available values will be populated from the FieldSettings.
 */
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
      value:
        (this.props.content && this.props.content[this.props.settings.Name]) || this.props.settings.DefaultValue || '',
    }

    this.handleChange = this.handleChange.bind(this)
  }

  /**
   * handle change event on an input
   * @param {SytheticEvent} event
   */
  public handleChange(value: string) {
    this.setState({ value })
    this.props.fieldOnChange && this.props.fieldOnChange(this.props.settings.Name, value as any)
  }
  /**
   * render
   * @return {ReactElement} markup
   */
  public render() {
    switch (this.props.actionName) {
      case 'edit':
      case 'new':
        return (
          <FormControl component={'fieldset' as 'div'} fullWidth={true} required={this.props.settings.Compulsory}>
            <FormLabel component={'legend' as 'label'}>{this.props.settings.DisplayName}</FormLabel>
            <ReactQuill
              style={{ background: '#fff', marginTop: 10 }}
              defaultValue={this.props.settings.DefaultValue}
              readOnly={this.props.settings.ReadOnly}
              modules={modules}
              onChange={this.handleChange}
              value={this.state.value}
              theme="snow"
            />
            <FormHelperText>{this.props.settings.Description}</FormHelperText>
          </FormControl>
        )
      case 'browse':
      default:
        return this.props.content &&
          this.props.content[this.props.settings.Name] &&
          this.props.content[this.props.settings.Name].length > 0 ? (
          <div>
            <Typography variant="caption" gutterBottom={true}>
              {this.props.settings.DisplayName}
            </Typography>

            <div dangerouslySetInnerHTML={{ __html: this.props.content[this.props.settings.Name] }} />
          </div>
        ) : null
    }
  }
}
