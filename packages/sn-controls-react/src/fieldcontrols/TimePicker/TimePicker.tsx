/**
 * @module FieldControls
 *
 */ /** */
import { TimePicker as MUITimePicker } from 'material-ui-pickers'
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils'
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider'
import * as React from 'react'
import { Fragment } from 'react'
import { ReactClientFieldSetting, ReactClientFieldSettingProps } from '../ClientFieldSetting'
import { ReactDateTimeFieldSetting } from '../DateTimeFieldSetting'

/**
 * Interface for DatePicker properties
 */
export interface TimePickerProps extends ReactClientFieldSettingProps, ReactClientFieldSetting, ReactDateTimeFieldSetting { }

/**
 * Field control that represents a Date field. Available values will be populated from the FieldSettings.
 */
export class TimePicker extends React.Component<TimePickerProps, { value }> {
    /**
     * constructor
     * @param {object} props
     */
    constructor(props: TimePickerProps) {
        super(props)
        /**
         * @type {object}
         * @property {string} value default value
         */
        this.state = {
            value: this.props['data-fieldValue'] ? this.setValue(this.props['data-fieldValue']) : this.setValue(this.props['data-defaultValue']),
        }
    }

    /**
     * convert string to proper date format
     * @param {string} value
     */
    public setValue(value) {
        // TODO: check datetimemode and return a value based on this property
        let date = ''
        if (value) {
            date = value.split('T')[0]
        } else {
            date = new Date().toISOString().split('T')[0]
        }
        return date
    }
    /**
     * handle changes
     * @param {Date} date
     */
    public handleDateChange = (date) => {
        this.setState({ value: date })
        this.props.onChange(this.props.name, date)
    }
    /**
     * render
     * @return {ReactElement} markup
     */
    public render() {
        const { value } = this.state
        const { readOnly, required } = this.props
        switch (this.props['data-actionName']) {
            case 'edit':
                return (
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <Fragment>
                            <MUITimePicker
                                defaultValue={value}
                                onChange={this.handleDateChange}
                                label={this.props['data-labelText']}
                                id={this.props.name}
                                disabled={readOnly}
                                placeholder={this.props['data-placeHolderText']}
                                required={required}
                                fullWidth
                            />
                        </Fragment>
                    </MuiPickersUtilsProvider>
                )
            case 'new':
                return (
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <Fragment>
                            <MUITimePicker
                                defaultValue={value}
                                onChange={this.handleDateChange}
                                label={this.props['data-labelText']}
                                id={this.props.name}
                                disabled={readOnly}
                                placeholder={this.props['data-placeHolderText']}
                                required={required}
                                fullWidth
                            />
                        </Fragment>
                    </MuiPickersUtilsProvider>
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
