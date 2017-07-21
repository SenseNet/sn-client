/**
 * @module FieldControls
 * 
 */ /** */
import * as React from 'react'
import { FieldSettings } from 'sn-client-js'
import { IClientFieldSetting, IReactClientFieldSetting } from '../IClientFieldSetting'
import { IRichTextEditorFieldSetting } from './IRichTextEditorFieldSetting'

import * as ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

import { styles } from './RichTextEditorStyles'
import './RichTextEditorStyles.css'
import { Input } from 'react-materialize'
import Radium from 'radium'

/**
 * Interface for RichTextEditor properties
 */
export interface RichTextEditorProps extends IReactClientFieldSetting, IClientFieldSetting, IRichTextEditorFieldSetting { }

/**
 * Field control that represents a LongText field. Available values will be populated from the FieldSettings.
 */
@Radium
export class RichTextEditor extends React.Component<RichTextEditorProps, { value }> {
    /**
     * constructor
     * @param {object} props
     */
    constructor(props) {
        super(props);
        /**
         * @type {object}
         * @property {string} value input value
         */
        this.state = {
            value: this.setValue(this.props['data-fieldValue'])
        };

        this.handleChange = this.handleChange.bind(this);
    }
    /**
     * returns default value of an input
     * @param {string} value
     */
    setValue(value) {
        if (value) {
            return value;
        }
        else {
            if (this.props['data-defaultValue']) {
                return this.props['data-defaultValue']
            }
            else {
                return ''
            }
        }
    }
    /**
     * handle change event on an input
     * @param {SytheticEvent} event
     */
    handleChange(event) {
        this.setState({ value: event.target.value });
    }
    /**
     * render
     * @return {ReactElement} markup
     */
    render() {
        switch (this.props['data-actionName']) {
            case 'edit':
                return (
                    <ReactQuill
                        name={this.props.name}
                        label={
                            this.props.required
                                ? this.props['data-labelText'] + ' *'
                                : this.props['data-labelText']
                        }
                        className={this.props.className}
                        //placeholder={this.props['data-placeHolderText']}
                        //placeHolderStyle?: object
                        style={this.props.style}
                        value={this.state.value}
                        readOnly={this.props.readOnly}
                        required={this.props.required}
                        disabled={this.props.readOnly}
                        error={this.props['data-errorText']}
                        s={12}
                        m={12}
                        l={12}
                        modules={modules}
                        formats={formats}
                    />
                )
            case 'new':
                return (
                    <ReactQuill
                        name={this.props.name}
                        label={
                            this.props.required
                                ? this.props['data-labelText'] + ' *'
                                : this.props['data-labelText']
                        }
                        className={this.props.className}
                        //placeholder={this.props['data-placeHolderText']}
                        //placeHolderStyle?: object
                        style={this.props.style}
                        defaultValue={this.props['data-defaultValue']}
                        readOnly={this.props.readOnly}
                        required={this.props.required}
                        disabled={this.props.readOnly}
                        error={this.props['data-errorText']}
                        s={12}
                        m={12}
                        l={12}
                        modules={modules}
                        formats={formats}
                    />
                )
            case 'browse':
                return (
                    <div>
                        <label>
                            {this.props['data-labelText']}
                        </label>
                        <div dangerouslySetInnerHTML={{ __html: this.props['data-fieldValue'] }} />
                    </div>
                )
            default:
                return (
                    <div>
                        <label>
                            {this.props['data-labelText']}
                        </label>
                        <div dangerouslySetInnerHTML={{ __html: this.props['data-fieldValue'] }} />
                    </div>
                )
        }

    }
}

const modules = {
    toolbar: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],

        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction

        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],

        ['clean']                                         // remove formatting button
    ]
};

const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
]