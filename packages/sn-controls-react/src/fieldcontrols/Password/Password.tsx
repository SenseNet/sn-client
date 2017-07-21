/**
 * @module FieldControls
 * 
 */ /** */
import * as React from 'react'
import { FieldSettings } from 'sn-client-js'
import { IClientFieldSetting, IReactClientFieldSetting } from '../IClientFieldSetting'
import { IPasswordFieldSetting } from './IPasswordFieldSetting'

import { styles } from './PasswordStyles'
import { Input } from 'react-materialize'
import Radium from 'radium'

/**
 * Interface for Password properties
 */
export interface PasswordProps extends IReactClientFieldSetting, IClientFieldSetting, IPasswordFieldSetting { }

/**
 * Field control that represents a Password field. Available values will be populated from the FieldSettings.
 */
@Radium
export class Password extends React.Component<PasswordProps, { value }> {
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
            value: ''
        };

        this.handleChange = this.handleChange.bind(this);
    }
    /**
     * convert incoming default value string to proper format
     * @param {string} value
     */
    setValue(value) {
        if (value) {
            return value.replace(/<[^>]*>/g, '');
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
                    <Input
                        type='password'
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
                        readOnly={this.props.readOnly}
                        min={this.props['data-minLength']}
                        max={this.props['data-maxLength']}
                        required={this.props.required}
                        disabled={this.props.readOnly}
                        error={this.props['data-errorText']}
                        s={12}
                        m={12}
                        l={12}
                    />
                )
            case 'new':
                return (
                    <Input
                        type='password'
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
                        readOnly={this.props.readOnly}
                        min={this.props['data-minLength']}
                        max={this.props['data-maxLength']}
                        required={this.props.required}
                        disabled={this.props.readOnly}
                        error={this.props['data-errorText']}
                        s={12}
                        m={12}
                        l={12}
                    />
                )
            default:
                break;
        }

    }
}