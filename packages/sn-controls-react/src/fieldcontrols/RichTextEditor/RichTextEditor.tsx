/**
 * @module FieldControls
 *
 */ /** */
import Typography from '@material-ui/core/Typography'
import React, { Component } from 'react'
import { ReactClientFieldSetting, ReactClientFieldSettingProps } from '../ClientFieldSetting'
import { ReactRichTextEditorFieldSetting } from './RichTextEditorFieldSetting'

import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

import Radium from 'radium'
import './RichTextEditorStyles.css'

/**
 * Interface for RichTextEditor properties
 */
export interface RichTextEditorProps extends ReactClientFieldSettingProps, ReactClientFieldSetting, ReactRichTextEditorFieldSetting { }

/**
 * Field control that represents a LongText field. Available values will be populated from the FieldSettings.
 */
@Radium
export class RichTextEditor extends Component<RichTextEditorProps, { value }> {
    /**
     * constructor
     * @param {object} props
     */
    constructor(props) {
        super(props)
        /**
         * @type {object}
         * @property {string} value input value
         */
        this.state = {
            value: this.setValue(this.props['data-fieldValue']),
        }

        this.handleChange = this.handleChange.bind(this)
    }
    /**
     * returns default value of an input
     * @param {string} value
     */
    public setValue(value) {
        if (value) {
            return value
        } else {
            if (this.props['data-defaultValue']) {
                return this.props['data-defaultValue']
            } else {
                return ''
            }
        }
    }
    /**
     * handle change event on an input
     * @param {SytheticEvent} event
     */
    public handleChange(value) {
        this.setState({ value })
        this.props.onChange(this.props.name, value)
    }
    /**
     * render
     * @return {ReactElement} markup
     */
    public render() {
        switch (this.props['data-actionName']) {
            case 'edit':
                return (
                    <ReactQuill
                        // name={this.props.name}
                        // label={
                        //     this.props.required
                        //         ? this.props['data-labelText'] + ' *'
                        //         : this.props['data-labelText']
                        // }
                        className={this.props.className}
                        // placeholder={this.props['data-placeHolderText']}
                        // placeHolderStyle?: object
                        style={this.props.style}
                        value={this.props.value}
                        readOnly={this.props.readOnly}
                        // required={this.props.required}
                        // disabled={this.props.readOnly}
                        // error={this.props['data-errorText']}
                        // s={12}
                        // m={12}
                        // l={12}
                        modules={modules}
                        formats={formats}
                        onChange={this.handleChange}
                    />
                )
            case 'new':
                return (
                    <ReactQuill
                        // name={this.props.name}
                        // label={
                        //     this.props.required
                        //         ? this.props['data-labelText'] + ' *'
                        //         : this.props['data-labelText']
                        // }
                        className={this.props.className}
                        // placeholder={this.props['data-placeHolderText']}
                        // placeHolderStyle?: object
                        style={this.props.style}
                        defaultValue={this.props['data-defaultValue']}
                        readOnly={this.props.readOnly}
                        // required={this.props.required}
                        // disabled={this.props.readOnly}
                        // error={this.props['data-errorText']}
                        // s={12}
                        // m={12}
                        // l={12}
                        modules={modules}
                        formats={formats}
                        onChange={this.handleChange}
                    />
                )
            case 'browse':
                return (
                    this.props.value && this.props.value.length > 0 ? <div className={this.props.className}>
                        <Typography variant="caption" gutterBottom>
                            {this.props['data-labelText']}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            <div dangerouslySetInnerHTML={{ __html: this.props.value }} />
                        </Typography>
                    </div> : null
                )
            default:
                return (
                    this.props.value && this.props.value.length > 0 ? <div className={this.props.className}>
                        <Typography variant="caption" gutterBottom>
                            {this.props['data-labelText']}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            <div dangerouslySetInnerHTML={{ __html: this.props.value }} />
                        </Typography>
                    </div> : null
                )
        }

    }
}

const modules = {
    toolbar: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],

        [{ header: 1 }, { header: 2 }],               // custom button values
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }],      // superscript/subscript
        [{ indent: '-1' }, { indent: '+1' }],          // outdent/indent
        [{ direction: 'rtl' }],                         // text direction

        [{ size: ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ header: [1, 2, 3, 4, 5, 6, false] }],

        [{ color: [] }, { background: [] }],          // dropdown with defaults from theme
        [{ font: [] }],
        [{ align: [] }],

        ['clean'],                                       // remove formatting button
    ],
}

const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
]
