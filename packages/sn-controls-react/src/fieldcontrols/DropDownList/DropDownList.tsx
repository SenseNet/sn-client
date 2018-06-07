/**
 * @module FieldControls
 *
 *//** */
import * as React from 'react'
import { ReactChoiceFieldSetting } from '../ChoiceFieldSetting'
import { ReactClientFieldSetting, ReactClientFieldSettingProps } from '../ClientFieldSetting'

import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'

/**
 * Interface for DatePicker properties
 */
export interface DropDownListProps extends ReactClientFieldSettingProps, ReactClientFieldSetting, ReactChoiceFieldSetting { }

/**
 * Field control that represents a Choice field. Available values will be populated from the FieldSettings.
 */
export class DropDownList extends React.Component<DropDownListProps, { value }> {
    /**
     * constructor
     * @param {object} props
     */
    constructor(props) {
        super(props)
        /**
         * @type {object}
         */
        this.state = {
            value: this.props['data-defaultValue'] || '',
        }
    }
    /**
     * sets the selected value in the state
     */
    public handleChange = (event) => {
        this.setState({ value: event.target.value })
        this.props.onChange(this.props.name, event.target.value)
    }
    /**
     * returns selected options value
     */
    public getSelectedValue() {
        let selected
        this.props.options.map((option) => {
            if (option.Selected) {
                selected = option.Value
            }
        })
        return selected
    }

    /**
     * returns selected options text by its value
     * @param {any} value
     */
    public getTextByValue(value) {
        let text = ''
        if (value) {
            this.props.options.map((option) => {
                if (option.Value === value.toString()) {
                    text = option.Text
                }
            })
        } else {
            this.props.options.map((option) => {
                if (option.Selected) {
                    text = option.Text
                }
            })
        }
        return text
    }

    /**
     * render
     * @return {ReactElement} markup
     */
    public render() {
        switch (this.props['data-actionName']) {
            case 'edit':
                return (
                    <FormControl
                        fullWidth={true}
                        required={this.props.required}
                        error={this.props['data-errorText'] && this.props['data-errorText'].length > 0 ? true : false}
                    >
                        <InputLabel htmlFor={this.props.name}>{this.props['data-labelText']}</InputLabel>
                        <Select
                            onChange={this.handleChange}
                            inputProps={{
                                name: this.props.name,
                                id: this.props.name,
                            }}
                            value={this.props['data-fieldValue'][0]}
                            multiple={this.props['data-allowMultiple']}
                            autoWidth={true}
                            fullWidth={true}
                        >
                            {this.props.options.map((option) => {
                                return (
                                    <MenuItem key={option.Value} value={option.Value}>{option.Text}</MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>
                )
            case 'new':
                return (
                    <FormControl
                        fullWidth={true}
                        required={this.props.required}
                        error={this.props['data-errorText'] && this.props['data-errorText'].length > 0 ? true : false}
                    >
                        <InputLabel htmlFor={this.props.name}>{this.props['data-labelText']}</InputLabel>
                        <Select
                            onChange={this.handleChange}
                            inputProps={{
                                name: this.props.name,
                                id: this.props.name,
                            }}
                            value={this.state.value}
                            multiple={this.props['data-allowMultiple']}
                            autoWidth={true}
                            fullWidth={true}
                        >
                            {this.props.options.map((option) => {
                                return (
                                    <MenuItem key={option.Value} value={option.Value}>{option.Text}</MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>
                )
            case 'browse':
                return (
                    <div>
                        <label>
                            {this.props['data-labelText']}
                        </label>
                        <div>
                            {this.getTextByValue(this.props['data-fieldValue'])}
                        </div>
                    </div>
                )
            default:
                return (
                    <div>
                        <label>
                            {this.props['data-labelText']}
                        </label>
                        <div>
                            {this.getTextByValue(this.props['data-fieldValue'])}
                        </div>
                    </div>
                )
        }
    }
}
