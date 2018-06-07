/**
 * @module FieldControls
 *
 */ /** */
import * as React from 'react'
import { ReactChoiceFieldSetting } from '../ChoiceFieldSetting'
import { ReactClientFieldSetting, ReactClientFieldSettingProps } from '../ClientFieldSetting'

import Checkbox from '@material-ui/core/Checkbox'
// import {
//     FormControl,
//     FormControlLabel,
//     FormGroup,
//     FormHelperText,
//     FormLabel,
// } from '@material-ui/core/Form'

import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormLabel from '@material-ui/core/FormLabel'

/**
 * Interface for CheckboxGroup properties
 */
export interface CheckboxGroupProps extends ReactClientFieldSettingProps, ReactClientFieldSetting, ReactChoiceFieldSetting { }

/**
 * Field control that represents a Choice field. Available values will be populated from the FieldSettings.
 */
export class CheckboxGroup extends React.Component<CheckboxGroupProps, { value }> {
    /**
     * constructor
     * @param {object} props
     */
    constructor(props) {
        super(props)
        this.state = {
            value: this.props['data-fieldValue'] || this.props['data-defaultValue'] || [],
        }
        this.handleChange = this.handleChange.bind(this)
    }
    /**
     * set selected value
     */
    public handleChange = (event) => {
        const { value } = this.state
        const newValue = event.target.value
        const checked = value
        const index = value.indexOf(newValue)
        if (this.props['data-allowMultiple']) {
            if (index > -1) {
                checked[index].splice(index, 1)
            } else {
                checked.push(newValue)
            }
        } else {
            if (index > -1) {
                checked[index].splice(index, 1)
            } else {
                checked[0] = newValue
            }
        }
        this.setState({
            value: checked,
        })
        this.props.onChange(this.props.name, checked)
    }
    /**
     * returns if an item is checked or not
     * @param {string} item
     */
    public isChecked(item) {
        return this.state.value.indexOf(item) > -1
    }
    /**
     * render
     * @return {ReactElement} markup
     */
    public render() {
        const { onChange } = this.props
        switch (this.props['data-actionName']) {
            case 'edit':
                return (
                    <FormControl component="fieldset">
                        <FormLabel component="legend">{this.props['data-labelText']}</FormLabel>
                        <FormGroup>
                            {this.props.options.map((option) => {
                                return <FormControlLabel
                                    key={option.Value}
                                    control={
                                        <Checkbox
                                            checked={this.isChecked(option.Value)}
                                            onChange={this.handleChange}
                                            value={option.Value}
                                        />
                                    }
                                    label={option.Text}
                                />
                            })}
                        </FormGroup>
                        <FormHelperText>{this.props['data-hintText']}</FormHelperText>
                    </FormControl>
                )
            case 'new':
                return (
                    <FormControl component="fieldset">
                        <FormLabel component="legend">{this.props['data-labelText']}</FormLabel>
                        <FormGroup>
                            {this.props.options.map((option) => {
                                return <FormControlLabel
                                    key={option.Value}
                                    control={
                                        <Checkbox
                                            checked={this.isChecked(option.Value)}
                                            onChange={onChange(this.props.name, option.Value)}
                                            value={option.Value}
                                        />
                                    }
                                    label={option.Text}
                                />
                            })}
                        </FormGroup>
                        <FormHelperText>{this.props['data-hintText']}</FormHelperText>
                    </FormControl>
                )
            case 'browse':
                return (
                    <span>under consctruction</span>
                )
            default:
                return (
                    <span>under consctruction</span>
                )
        }
    }
}
