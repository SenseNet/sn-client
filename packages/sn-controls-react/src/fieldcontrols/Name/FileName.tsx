/**
 * @module FieldControls
 *
 */ /** */
import * as React from 'react'
import { ReactClientFieldSetting, ReactClientFieldSettingProps } from '../ClientFieldSetting'
import { ReactFileNameFieldSetting } from './FileNameFieldSetting'

import FormControl from '@material-ui/core/FormControl'
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import Radium from 'radium'

/**
 * Interface for Name properties
 */
export interface FileNameProps extends ReactClientFieldSettingProps, ReactClientFieldSetting, ReactFileNameFieldSetting { }

/**
 * Field control that represents a ShortText field. Available values will be populated from the FieldSettings.
 */
@Radium
export class FileName extends React.Component<FileNameProps, { value, isValid, error, extension }> {
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
            isValid: this.props.required ? false : true,
            error: '',
            // tslint:disable-next-line:no-string-literal
            extension: this.props['data-extension'] || this.getExtensionFromValue(this.props['content'].Name),
        }

        this.handleChange = this.handleChange.bind(this)
    }
    /**
     * convert incoming default value string to proper format
     * @param {string} value
     */
    public setValue(value) {
        if (value) {
            return value.replace(/<[^>]*>/g, '').split('.').slice(0, -1).join('.')
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
    public handleChange(e) {
        const { onChange } = this.props
        const value = `${e.target.value}.${this.state.extension}`
        // tslint:disable-next-line:no-string-literal
        onChange(this.props.name, `${value}`)
    }

    /**
     * Returns an extension from a file name
     */
    public getExtensionFromValue = (filename) => {
        return filename.substr(filename.lastIndexOf('.') + 1)
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
                        error={this.props['data-errorText'] && this.props['data-errorText'].length > 0 ? true : false}
                        required={this.props.required}
                        disabled={this.props.readOnly}
                        fullWidth>
                        <TextField
                            name={this.props.name}
                            id={this.props.name}
                            label={this.props['data-labelText']}
                            className={this.props.className}
                            placeholder={this.props['data-placeHolderText']}
                            style={this.props.style}
                            defaultValue={this.state.value}
                            onChange={(e) => this.handleChange(e)}
                            InputProps={{
                                // tslint:disable-next-line:no-string-literal
                                endAdornment: <InputAdornment position="end"><span>{`.${this.getExtensionFromValue(this.props['content'].Name)}`}</span></InputAdornment>,
                            }}
                            autoFocus
                        />
                    </FormControl>
                )
            case 'new':
                return (
                    <FormControl
                        error={this.props['data-errorText'] && this.props['data-errorText'].length > 0 ? true : false}
                        required={this.props.required}
                        disabled={this.props.readOnly}
                        fullWidth>
                        <TextField
                            name={this.props.name}
                            id={this.props.name}
                            label={this.props['data-labelText']}
                            className={this.props.className}
                            placeholder={this.props['data-placeHolderText']}
                            style={this.props.style}
                            defaultValue={this.state.value}
                            onChange={(e) => this.handleChange(e)}
                            InputProps={{
                                endAdornment: <InputAdornment position="end"><span>{`.${this.props['data-extension']}`}</span></InputAdornment>,
                            }}
                            autoFocus
                        />
                    </FormControl>
                )
            case 'browse':
                return (
                    <div>
                        <label>
                            {this.props['data-labelText']}
                        </label>
                        <p>
                            {this.props['data-fieldValue']}
                        </p>
                    </div>
                )
            default:
                return (
                    <div>
                        <label>
                            {this.props['data-labelText']}
                        </label>
                        <p>
                            {this.props['data-fieldValue']}
                        </p>
                    </div>
                )
        }

    }
}
