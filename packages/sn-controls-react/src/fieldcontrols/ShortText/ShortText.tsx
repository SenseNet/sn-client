/**
 * @module FieldControls
 * 
 */ /** */
import * as React from 'react'
import { FieldSettings } from 'sn-client-js'
import { IClientFieldSetting, IReactClientFieldSetting } from '../IClientFieldSetting'
import { IShortTextFieldSetting } from './IShortTextFieldSetting'

import { styles } from './ShortTextStyles'
import { Input } from 'react-materialize'
import Radium from 'radium'

/**
 * Interface for ShortText properties
 */
export interface ShortTextProps extends IReactClientFieldSetting, IClientFieldSetting, IShortTextFieldSetting { }

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
                    <Input
                        name={this.props.name}
                        type='text'
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
                        disabled={this.props.readOnly}
                        required={this.props.required}
                        error={this.props['data-errorText']}
                        s={12}
                        m={12}
                        l={12}
                        onChange={this.handleChange}
                    />
                )
            case 'new':
                return (
                    <Input
                        name={this.props.name}
                        type='text'
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
                        disabled={this.props.readOnly}
                        required={this.props.required}
                        error={this.props['data-errorText']}
                        s={12}
                        m={12}
                        l={12}
                        onChange={this.handleChange}
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