/**
 * @module FieldControls
 *
 */ /** */
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormLabel from '@material-ui/core/FormLabel'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import * as React from 'react'
import { ReactChoiceFieldSetting } from '../ChoiceFieldSetting'
import { ReactClientFieldSetting, ReactClientFieldSettingProps } from '../ClientFieldSetting'

/**
 * Interface for RadioButton properties
 */
export interface RadioButtonGroupProps extends ReactClientFieldSettingProps, ReactClientFieldSetting, ReactChoiceFieldSetting { }

/**
 * Field control that represents a Choice field. Available values will be populated from the FieldSettings.
 */
export class RadioButtonGroup extends React.Component<RadioButtonGroupProps, { value }> {
    /**
     * constructor
     * @param {object} props
     */
    constructor(props) {
        super(props)
        this.state = {
            value: this.props['data-fieldValue'][0] || this.props['data-defaultValue'] || null,
        }
        this.handleChange = this.handleChange.bind(this)
    }
    /**
     * set selected value
     */
    public handleChange = (event) => {
        this.setState({ value: event.target.value })
        this.props.onChange(this.props.name, event.target.value)
    }
    /**
     * render
     * @return {ReactElement} markup
     */
    public render() {
        switch (this.props['data-actionName']) {
            case 'edit':
                return (
                    <FormControl component="fieldset" error={this.props['data-errorText'] && this.props['data-errorText'].length > 0 ? true : false} required={this.props.required}>
                        <FormLabel component="legend">{this.props['data-labelText']}</FormLabel>
                        <RadioGroup
                            aria-label={this.props['data-labelText']}
                            name={this.props.name}
                            value={this.state.value}
                            onChange={(e) => this.handleChange(e)}
                        >
                            {this.props.options.map((option) => {
                                return <FormControlLabel
                                    key={option.Value}
                                    value={option.Value}
                                    control={
                                        <Radio />
                                    }
                                    label={option.Text}
                                />
                            })}
                        </RadioGroup>
                        <FormHelperText>{this.props['data-hintText']}</FormHelperText>
                    </FormControl>
                )
            case 'new':
                return (
                    <FormControl component="fieldset" error={this.props['data-errorText'] && this.props['data-errorText'].length > 0 ? true : false} required={this.props.required}>
                        <FormLabel component="legend">{this.props['data-labelText']}</FormLabel>
                        <RadioGroup
                            aria-label={this.props['data-labelText']}
                            name={this.props.name}
                            value={this.state.value}
                            onChange={(e) => this.handleChange(e)}
                        >
                            {this.props.options.map((option) => {
                                return <FormControlLabel
                                    key={option.Value}
                                    value={option.Value}
                                    control={
                                        <Radio />
                                    }
                                    label={option.Text}
                                />
                            })}
                        </RadioGroup>
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
