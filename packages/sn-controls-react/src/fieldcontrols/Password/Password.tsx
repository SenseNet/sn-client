/**
 * @module FieldControls
 *
 */ /** */
import React, { Component } from 'react'
import { ReactClientFieldSetting, ReactClientFieldSettingProps } from '../ClientFieldSetting'
import { ReactPasswordFieldSetting } from './PasswordFieldSetting'

import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import IconButton from '@material-ui/core/IconButton'
import Input from '@material-ui/core/Input'
import InputAdornment from '@material-ui/core/InputAdornment'
import InputLabel from '@material-ui/core/InputLabel'
import { Icon } from '@sensenet/icons-react'
import Radium from 'radium'

/**
 * Interface for Password properties
 */
export interface PasswordProps extends ReactClientFieldSettingProps, ReactClientFieldSetting, ReactPasswordFieldSetting { }

/**
 * Field control that represents a Password field. Available values will be populated from the FieldSettings.
 */
@Radium
export class Password extends Component<PasswordProps, { value, showPassword }> {
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
            value: '',
            showPassword: false,
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
     * handle change event on an input
     * @param {SytheticEvent} event
     */
    public handleChange(event) {
        this.setState({ value: event.target.value })
    }
    /**
     * handle clicking on show password icon
     */
    public handleClickShowPassword = () => {
        this.setState((state) => ({ showPassword: !state.showPassword }))
    }
    /**
     * render
     * @return {ReactElement} markup
     */
    public render() {
        switch (this.props['data-actionName']) {
            case 'edit':
                return (
                    <FormControl className={this.props.className}>
                        <InputLabel htmlFor={this.props.name}>{this.props['data-labelText']}</InputLabel>
                        <Input
                            type={this.state.showPassword ? 'text' : 'password'}
                            name={this.props.name}
                            id={this.props.name}
                            className={this.props.className}
                            placeholder={this.props['data-placeHolderText']}
                            style={this.props.style}
                            defaultValue={this.state.value}
                            required={this.props.required}
                            disabled={this.props.readOnly}
                            error={this.props['data-errorText'] && this.props['data-errorText'].length > 0 ? true : false}
                            fullWidth
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="Toggle password visibility"
                                        onClick={this.handleClickShowPassword}
                                    >
                                        {this.state.showPassword ? <Icon iconName="visibility_off" color="inherit" /> : <Icon iconName="visibility" color="inherit" />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                        <FormHelperText>{this.props['data-hintText']}</FormHelperText>
                        <FormHelperText>{this.props['data-errorText']}</FormHelperText>
                    </FormControl>
                )
            case 'new':
                return (
                    <FormControl className={this.props.className}>
                        <InputLabel htmlFor={this.props.name}>{this.props['data-labelText']}</InputLabel>
                        <Input
                            type={this.state.showPassword ? 'text' : 'password'}
                            name={this.props.name}
                            id={this.props.name}
                            className={this.props.className}
                            placeholder={this.props['data-placeHolderText']}
                            style={this.props.style}
                            defaultValue={this.state.value}
                            required={this.props.required}
                            disabled={this.props.readOnly}
                            error={this.props['data-errorText'] && this.props['data-errorText'].length > 0 ? true : false}
                            fullWidth
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="Toggle password visibility"
                                        onClick={this.handleClickShowPassword}
                                    >
                                        {this.state.showPassword ? <Icon iconName="visibility_off" color="inherit" /> : <Icon iconName="visibility" color="inherit" />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                        <FormHelperText>{this.props['data-hintText']}</FormHelperText>
                        <FormHelperText>{this.props['data-errorText']}</FormHelperText>
                    </FormControl>
                )
            default:
                return (
                    <div>
                        <label>
                            {this.props['data-labelText']}
                        </label>
                    </div>
                )
        }
    }
}
