/**
 * @module FieldControls
 *
 */ /** */
import React, { Component } from 'react'
import { ReactClientFieldSetting, ReactClientFieldSettingProps } from '../ClientFieldSetting'
import { ReactDisplayNameFieldSetting } from './DisplayNameFieldSetting'

import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Radium from 'radium'

/**
 * Interface for DisplayName properties
 */
export interface DisplayNameProps extends ReactClientFieldSettingProps, ReactClientFieldSetting, ReactDisplayNameFieldSetting { }

/**
 * Field control that represents a ShortText field. Available values will be populated from the FieldSettings.
 */
@Radium
export class DisplayName extends Component<DisplayNameProps, { value }> {
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
                        autoFocus={true}
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
                        defaultValue={this.props['data-defaultValue']}
                        required={this.props.required}
                        disabled={this.props.readOnly}
                        error={this.props['data-errorText'] && this.props['data-errorText'].length > 0 ? true : false}
                        fullWidth
                        autoFocus={true}
                        onChange={(e) => this.handleChange(e)}
                    />
                )
            case 'browse':
                return (
                    this.props.value && this.props.value.length > 0 ? <div className={this.props.className}>
                        <Typography variant="caption" gutterBottom>
                            {this.props['data-labelText']}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            {this.props.value}
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
                            {this.props.value}
                        </Typography>
                    </div> : null
                )
        }

    }
}
