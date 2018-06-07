/**
 * @module FieldControls
 *
 */ /** */
import { DateTimePicker as MUIDateTimePicker } from 'material-ui-pickers'
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils'
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider'
import * as moment from 'moment'
import * as React from 'react'
import { Fragment } from 'react'
import { ReactClientFieldSetting, ReactClientFieldSettingProps } from '../ClientFieldSetting'
import { ReactDateTimeFieldSetting } from '../DateTimeFieldSetting'

/**
 * Interface for DatePicker properties
 */
export interface DateTimePickerProps extends ReactClientFieldSettingProps, ReactClientFieldSetting, ReactDateTimeFieldSetting { }

/**
 * Field control that represents a Date field. Available values will be populated from the FieldSettings.
 */
export class DateTimePicker extends React.Component<DateTimePickerProps, { value, dateValue }> {
    /**
     * constructor
     * @param {object} props
     */
    constructor(props: DateTimePickerProps) {
        super(props)
        /**
         * @type {object}
         * @property {string} value default value
         */
        this.state = {
            dateValue: props['data-fieldValue'] ? new Date(this.setValue(props['data-fieldValue'])) : new Date(this.setValue(props['data-defaultValue'])),
            value: props['data-fieldValue'] ? props['data-fieldValue'] : props['data-defaultValue'],
        }
        this.handleDateChange = this.handleDateChange.bind(this)
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
        this.setState({
            dateValue: date,
            value: moment.utc(date),
        })
        this.props.onChange(this.props.name, moment.utc(date))
    }
    /**
     * render
     * @return {ReactElement} markup
     */
    public render() {
        const { dateValue } = this.state
        const { readOnly, required } = this.props
        switch (this.props['data-actionName']) {
            case 'edit':
                return (
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <Fragment>
                            <MUIDateTimePicker
                                value={dateValue}
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
                            <MUIDateTimePicker
                                value={dateValue}
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
