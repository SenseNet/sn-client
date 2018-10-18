/**
 * @module FieldControls
 *
 */ /** */
import React, { Component } from 'react'
import { ReactClientFieldSetting, ReactClientFieldSettingProps } from '../ClientFieldSetting'
import { ReactLongTextFieldSetting } from '../LongTextFieldSetting'
import { ReactTextareaFieldSetting } from './TextareaFieldSetting'

import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Radium from 'radium'

/**
 * Interface for Textarea properties
 */
export interface TextareaProps extends ReactClientFieldSettingProps, ReactClientFieldSetting, ReactLongTextFieldSetting, ReactTextareaFieldSetting { }

/**
 * Field control that represents a LongText field. Available values will be populated from the FieldSettings.
 */
@Radium
export class Textarea extends Component<TextareaProps, { value }> {
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
     * handle change event on an input
     * @param {SytheticEvent} event
     */
    public handleChange(event) {
        this.setState({ value: event.target.value })
        this.props.onChange(this.props.name, event.target.value)
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
                        value={this.props.value}
                        required={this.props.required}
                        disabled={this.props.readOnly}
                        error={this.props['data-errorText'] && this.props['data-errorText'].length > 0 ? true : false}
                        multiline={true}
                        fullWidth
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
                        multiline={true}
                        fullWidth
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
