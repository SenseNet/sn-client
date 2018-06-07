/**
 * @module FieldControls
 *
 */ /** */
import * as React from 'react'
import { ReactClientFieldSetting, ReactClientFieldSettingProps } from '../ClientFieldSetting'
import { ReactShortTextFieldSetting } from '../ShortText/ShortTextFieldSetting'
import { ReactNameFieldSetting } from './NameFieldSetting'

import { FormControl, FormHelperText } from '@material-ui/core'
import TextField from '@material-ui/core/TextField'
import Radium from 'radium'

/**
 * Interface for Name properties
 */
export interface NameProps extends ReactClientFieldSettingProps, ReactClientFieldSetting, ReactShortTextFieldSetting, ReactNameFieldSetting { }

/**
 * Field control that represents a ShortText field. Available values will be populated from the FieldSettings.
 */
@Radium
export class Name extends React.Component<NameProps, { value, isValid, error }> {
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
        }

        this.handleChange = this.handleChange.bind(this)
    }
    /**
     * convert incoming default value string to proper format
     * @param {string} value
     */
    public setValue(value) {
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
    public handleChange(e) {
        const { onChange } = this.props
        const value = e.target.value
        this.setState({ value })
        onChange(this.props.name, value)
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
                        />
                        <FormHelperText id="name-error-text"><div>Error</div></FormHelperText>
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
                        />
                        <FormHelperText id="name-error-text"><div>Error</div></FormHelperText>
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
