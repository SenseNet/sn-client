/**
 * @module FieldControls
 * 
 */ /** */
import * as React from 'react'
import { FieldSettings } from 'sn-client-js'
import { IClientFieldSetting, IReactClientFieldSetting } from '../IClientFieldSetting'
import { IDateTimeFieldSetting } from '../IDateTimeFieldSetting'

import { Input } from 'react-materialize'
import { styles } from './DatePickerStyles'

/**
 * Interface for DatePicker properties
 */
export interface DatePickerProps extends IReactClientFieldSetting, IClientFieldSetting, IDateTimeFieldSetting { }

/**
 * Field control that represents a Date field. Available values will be populated from the FieldSettings.
 */
export class DatePicker extends React.Component<DatePickerProps, { value }> {
    /**
     * constructor
     * @param {object} props
     */
    constructor(props: DatePickerProps) {
        super(props);
        /**
         * @type {object}
         * @property {string} value default value
         */
        this.state = {
            value: this.props['data-fieldValue'] ? this.setValue(this.props['data-fieldValue']) : this.setValue(this.props['data-defaultValue'])
        };
    }

    /**
     * convert string to proper date format
     * @param {string} value
     */
    setValue(value) {
        //TODO: check datetimemode and return a value based on this property
        let date = '';
        if (value) {
            date = value.split('T')[0]
        }
        else {
            date = new Date().toISOString().split('T')[0]
        }
        return date
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
                        name='on'
                        type='date'
                        label={
                            this.props.required
                                ? this.props['data-labelText'] + ' *'
                                : this.props['data-labelText']
                        }
                        defaultValue={this.state.value}
                        readOnly={this.props.readOnly}
                        onChange={function (e, value) { }}
                        s={12} />
                )
            case 'new':
                return (
                    <Input
                        name='on'
                        type='date'
                        label={
                            this.props.required
                                ? this.props['data-labelText'] + ' *'
                                : this.props['data-labelText']
                        }
                        defaultValue={this.state.value}
                        readOnly={this.props.readOnly}
                        onChange={function (e, value) { }}
                        s={12} />
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