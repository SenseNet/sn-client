/**
 * @module FieldControls
 *
 */ /** */
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import Radium from 'radium'
import * as React from 'react'
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
export class Number extends React.Component<NumberProps, { value, numberFormat }> {

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
    public handleChange(event) {
        this.setState({
            value: event.target.value,
        })
        this.props.onChange(this.props.name, event.target.value)
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
        const { inputRef, onChange, ...other,
        } = props
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
     * render
     * @return {ReactElement} markup
     */
    public render() {
        const { value } = this.state
        switch (this.props['data-actionName']) {
            case 'edit':
                return (
                    <TextField
                        name={this.props.name}
                        label={this.props['data-labelText']}
                        className={this.props.className}
                        style={this.props.style}
                        defaultValue={value}
                        required={this.props.required}
                        disabled={this.props.readOnly}
                        error={this.props['data-']}
                        onChange={(e) => this.props.onChange(this.props.name, e.target.value)}
                        InputProps={{
                            startAdornment: this.props['data-isPercentage'] ? <InputAdornment position="start">%</InputAdornment> : null,
                          }}
                        id={this.props.name}
                        fullWidth
                    />
                )
            case 'new':
                return (
                    <TextField
                        name={this.props.name}
                        label={this.props['data-labelText']}
                        className={this.props.className}
                        style={this.props.style}
                        defaultValue={value}
                        required={this.props.required}
                        disabled={this.props.readOnly}
                        error={this.props['data-']}
                        onChange={(e) => this.props.onChange(this.props.name, e.target.value)}
                        InputProps={{
                            startAdornment: this.props['data-isPercentage'] ? <InputAdornment position="start">%</InputAdornment> : null,
                          }}
                        id={this.props.name}
                        fullWidth
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
                            {this.props['data-isPercentage'] ? '%' : ''}
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
                            {this.props['data-isPercentage'] ? '%' : ''}
                        </p>
                    </div>
                )
        }

    }
}
