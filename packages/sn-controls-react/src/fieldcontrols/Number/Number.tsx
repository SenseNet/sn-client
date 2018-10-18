/**
 * @module FieldControls
 *
 */ /** */
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Radium from 'radium'
import React, { Component } from 'react'
import NumberFormat from 'react-number-format'
import { ReactClientFieldSetting, ReactClientFieldSettingProps } from '../ClientFieldSetting'
import { ReactNumberFieldSetting } from './NumberFieldSetting'

/**
 * Interface for Number properties
 */
export interface NumberProps extends ReactClientFieldSettingProps, ReactClientFieldSetting, ReactNumberFieldSetting { }

/**
 * Field control that represents a Number field. Available values will be populated from the FieldSettings.
 */
@Radium
export class Number extends Component<NumberProps, { value, numberFormat }> {

    constructor(props) {
        super(props)
        this.state = {
            value: this.props['data-fieldValue'] ? this.setValue(this.props['data-fieldValue']) : this.setValue(this.props['data-defaultValue']),
            numberFormat: '1320',
        }
        this.numberFormatCustom = this.numberFormatCustom.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }
    /**
     * handle changes
     * @param {string} name
     * @param {event} event
     */
    public handleChange(e) {
        const { name, onChange } = this.props
        const value = e.target.value
        onChange(name, value)
    }
    /**
     * convert incoming default value string to proper format
     * @param {string} value
     */
    public setValue(value) {
        if (value) {
            return value
        } else {
            if (this.props['data-defaultValue']) {
                return this.props['data-defaultValue']
            } else {
                return null
            }
        }
    }

    // TODO: integer, decimal+digits
    /**
     * returns whether the value is valid or not
     * @param {number} value
     */
    public isValid(value) {
        return value > this.props.min && value < this.props.max
    }
    /**
     * format text to predefined number format
     * @param {any} props
     */
    public numberFormatCustom(props) {
        const { inputRef, onChange, ...other } = props
        return (
            <NumberFormat
                {...other}
                ref={inputRef}
                onValueChange={(values) => {
                    onChange({
                        target: {
                            value: values.value,
                        },
                    })
                }}
                thousandSeparator
                prefix="$"
            />
        )
    }
    /**
     * Returns steps value by decimal and step settings
     */
    public defineStepValue = () => {
        return this.props['data-decimal'] && this.props['data-step'] === undefined ? 0.1 : this.props['data-step'] ? this.props['data-step'] : 1
    }
    /**
     * Returns inputadornment by currency and percentage settings
     */
    public defineCurrency = () => {
        let currency = null
        if (this.props['data-isCurrency']) {
            currency = this.props['data-currency'] ? <InputAdornment position="start">{this.props['data-currency']}</InputAdornment> : <InputAdornment position="start">$</InputAdornment>
        } else {
            currency = this.props['data-isPercentage'] ? <InputAdornment position="start">%</InputAdornment> : null
        }
        return currency
    }
    /**
     * render
     * @return {ReactElement} markup
     */
    public render() {
        console.log(this.props['data-fieldValue'])
        switch (this.props['data-actionName']) {
            case 'edit':
                return (
                    <TextField
                        name={this.props.name}
                        type="number"
                        label={this.props['data-labelText']}
                        className={this.props.className}
                        style={this.props.style}
                        value={this.props['data-fieldValue']}
                        required={this.props.required}
                        disabled={this.props.readOnly}
                        InputProps={{
                            startAdornment: this.defineCurrency(),
                        }}
                        inputProps={{
                            step: this.defineStepValue(),
                            max: this.props.max ? this.props.max : null,
                            min: this.props.min ? this.props.min : null,
                        }}
                        id={this.props.name}
                        error={this.props['data-errorText'] && this.props['data-errorText'].length > 0 ? true : false}
                        fullWidth
                        onChange={(e) => this.handleChange(e)}
                        helperText={this.props['data-hintText']}
                    />
                )
            case 'new':
                return (
                    <TextField
                        name={this.props.name}
                        type="number"
                        label={this.props['data-labelText']}
                        className={this.props.className}
                        style={this.props.style}
                        defaultValue={this.props['data-defaultValue']}
                        required={this.props.required}
                        disabled={this.props.readOnly}
                        InputProps={{
                            startAdornment: this.defineCurrency(),
                        }}
                        inputProps={{
                            step: this.defineStepValue(),
                            max: this.props.max ? this.props.max : null,
                            min: this.props.min ? this.props.min : null,
                        }}
                        id={this.props.name}
                        error={this.props['data-errorText'] && this.props['data-errorText'].length > 0 ? true : false}
                        fullWidth
                        onChange={(e) => this.handleChange(e)}
                        helperText={this.props['data-hintText']}
                    />
                )
            case 'browse':
                return (
                    this.props.value ? <div className={this.props.className}>
                        <Typography variant="caption" gutterBottom>
                            {this.props['data-labelText']}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            {this.props['data-isCurrency'] ? this.props['data-currency'] ? this.props['data-currency'] : '$' : null}
                            {this.props['data-isPercentage'] ? '%' : null}
                            {this.props.value}
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
                            {this.props['data-isCurrency'] ? this.props['data-currency'] ? this.props['data-currency'] : '$' : null}
                            {this.props['data-isPercentage'] ? '%' : null}
                            {this.props.value}
                        </Typography>
                    </div> : null
                )
        }

    }
}
