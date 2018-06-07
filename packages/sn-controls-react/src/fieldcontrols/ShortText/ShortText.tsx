/**
 * @module FieldControls
 *
 */ /** */
import * as React from 'react'
import { ReactClientFieldSetting, ReactClientFieldSettingProps } from '../ClientFieldSetting'
import { ReactShortTextFieldSetting } from './ShortTextFieldSetting'

import TextField from '@material-ui/core/TextField'
import Radium from 'radium'

/**
 * Interface for ShortText properties
 */
export interface ShortTextProps extends ReactClientFieldSettingProps, ReactClientFieldSetting, ReactShortTextFieldSetting { }

/**
 * Field control that represents a ShortText field. Available values will be populated from the FieldSettings.
 */
@Radium
export class ShortText extends React.Component<ShortTextProps, { value }> {
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
     * Handles input changes. Dispatches a redux action to change field value in the state tree.
     * @param e
     */
    public handleChange(e) {
        const { name, onChange } = this.props
        const value = e.target.value
        onChange(name, value)
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
                        name={this.props.name}
                        id={this.props.name}
                        label={this.props['data-labelText']}
                        className={this.props.className}
                        placeholder={this.props['data-placeHolderText']}
                        style={this.props.style}
                        defaultValue={this.state.value}
                        required={this.props.required}
                        disabled={this.props.readOnly}
                        error={this.props['data-errorText'] && this.props['data-errorText'].length > 0 ? true : false}
                        fullWidth
                        onChange={(e) => this.handleChange(e)}
                    />
                )
            case 'new':
                return (
                    <TextField
                        name={this.props.name}
                        id={this.props.name}
                        label={this.props['data-labelText']}
                        className={this.props.className}
                        placeholder={this.props['data-placeHolderText']}
                        style={this.props.style}
                        defaultValue={this.state.value}
                        required={this.props.required}
                        disabled={this.props.readOnly}
                        error={this.props['data-errorText'] && this.props['data-errorText'].length > 0 ? true : false}
                        fullWidth
                    />
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
