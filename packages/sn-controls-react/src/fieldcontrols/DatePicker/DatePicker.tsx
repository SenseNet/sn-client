/**
 * @module FieldControls
 *
 */ /** */
import FormHelperText from '@material-ui/core/FormHelperText'
import Typography from '@material-ui/core/Typography'
import { DatePicker as MUIDatePicker } from 'material-ui-pickers'
import MomentUtils from 'material-ui-pickers/utils/moment-utils'
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider'
import moment from 'moment'
import React, { Component, Fragment } from 'react'
import { ReactClientFieldSetting, ReactClientFieldSettingProps } from '../ClientFieldSetting'
import { ReactDateTimeFieldSetting } from '../DateTimeFieldSetting'

/**
 * Interface for DatePicker properties
 */
export interface DatePickerProps extends ReactClientFieldSettingProps, ReactClientFieldSetting, ReactDateTimeFieldSetting { }

/**
 * Field control that represents a Date field. Available values will be populated from the FieldSettings.
 */
export class DatePicker extends Component<DatePickerProps, {}> {
    /**
     * constructor
     * @param {object} props
     */
    constructor(props: DatePickerProps) {
        super(props)
        /**
         * @type {object}
         * @property {string} value default value
         */
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
        this.props.onChange(this.props.name, moment.utc(date))
    }
    /**
     * render
     * @return {ReactElement} markup
     */
    public render() {
        const { readOnly, required } = this.props
        switch (this.props['data-actionName']) {
            case 'edit':
                return (
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                        <Fragment>
                            <MUIDatePicker
                                value={this.props.value}
                                onChange={this.handleDateChange}
                                label={this.props['data-labelText']}
                                id={this.props.name}
                                disabled={readOnly}
                                placeholder={this.props['data-placeHolderText']}
                                required={required}
                                fullWidth
                                className={this.props.className}
                            />
                        </Fragment>
                        <FormHelperText>{this.props['data-hintText']}</FormHelperText>
                        <FormHelperText color="error">{this.props['data-errorText']}</FormHelperText>
                    </MuiPickersUtilsProvider>
                )
            case 'new':
                return (
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                        <Fragment>
                            <MUIDatePicker
                                value={this.props['data-defaultValue']}
                                onChange={this.handleDateChange}
                                label={this.props['data-labelText']}
                                id={this.props.name}
                                disabled={readOnly}
                                placeholder={this.props['data-placeHolderText']}
                                required={required}
                                fullWidth
                                className={this.props.className}
                            />
                            <FormHelperText>{this.props['data-hintText']}</FormHelperText>
                            <FormHelperText color="error">{this.props['data-errorText']}</FormHelperText>
                        </Fragment>
                    </MuiPickersUtilsProvider>
                )
            case 'browse':
                let displayedValue
                switch (this.props['data-displayMode']) {
                    case 'relative':
                        displayedValue = moment(this.props.value).fromNow()
                        break
                    case 'calendar':
                        displayedValue = moment(this.props.value).format('dddd, MMMM Do YYYY')
                        break
                    case 'raw':
                        displayedValue = this.props.value
                        break
                    default:
                        displayedValue = this.props.value
                }
                return (
                    this.props.value ? <div className={this.props.className}>
                        <Typography variant="caption" gutterBottom>
                            {this.props['data-labelText']}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            {displayedValue}
                        </Typography>
                    </div> : null
                )
            default:
                return (
                    this.props.value ? <div className={this.props.className}>
                        <Typography variant="caption" gutterBottom>
                            {this.props['data-labelText']}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            {moment(this.props.value)}
                        </Typography>
                    </div> : null
                )
        }
    }
}
