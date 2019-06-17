/* eslint-disable dot-notation */
/**
 * @module FieldControls
 */
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormLabel from '@material-ui/core/FormLabel'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import { GenericContent } from '@sensenet/default-content-types'
import React, { Component } from 'react'
import { ReactChoiceFieldSetting } from '../ChoiceFieldSetting'
import { ReactClientFieldSetting, ReactClientFieldSettingProps } from '../ClientFieldSetting'

/**
 * Interface for RadioButton properties
 */
export interface RadioButtonGroupProps<T extends GenericContent, K extends keyof T>
  extends ReactClientFieldSettingProps<T, K>,
    ReactClientFieldSetting<T, K>,
    ReactChoiceFieldSetting<T, K> {}
/**
 * Interface for RadioButton state
 */
export interface RadioButtonGroupState {
  value: any[]
}
/**
 * Field control that represents a Choice field. Available values will be populated from the FieldSettings.
 */
export class RadioButtonGroup<T extends GenericContent, K extends keyof T> extends Component<
  RadioButtonGroupProps<T, K>,
  RadioButtonGroupState
> {
  /**
   * constructor
   * @param {object} props
   */
  constructor(props: RadioButtonGroupProps<T, K>) {
    super(props)
    this.state = {
      value: this.props['data-fieldValue'] || this.props['defaultValue'] || [this.props.options[0].Value],
    }
    this.handleChange = this.handleChange.bind(this)
  }
  /**
   * set selected value
   */
  public handleChange = (event: React.ChangeEvent) => {
    const { value } = this.state
    const newValue = event.target['value']
    const checked = value
    const index = value.indexOf(newValue.toString())

    if (index > -1) {
      checked.splice(index, 1)
    } else {
      checked[0] = newValue
    }
    this.setState({
      value: checked,
    })
    this.props.onChange(this.props.name, checked as any)
  }
  /**
   * render
   * @return {ReactElement} markup
   */
  public render() {
    switch (this.props['actionName']) {
      case 'edit':
        return (
          <FormControl
            component={'fieldset' as 'div'}
            fullWidth={true}
            error={this.props['data-errorText'] && this.props['data-errorText'].length > 0 ? true : false}
            required={this.props.required}
            className={this.props.className}>
            <FormLabel component={'legend' as 'label'}>{this.props['labelText']}</FormLabel>
            <RadioGroup
              aria-label={this.props['labelText']}
              name={this.props.name as string}
              value={this.state.value[0].toString()}
              onChange={this.handleChange as any}>
              {this.props.options.map(option => {
                return (
                  <FormControlLabel
                    key={option.Value}
                    value={option.Value.toString()}
                    control={<Radio />}
                    label={option.Text}
                    disabled={this.props.readOnly}
                  />
                )
              })}
            </RadioGroup>
            <FormHelperText>{this.props['hintText']}</FormHelperText>
            <FormHelperText>{this.props['data-errorText']}</FormHelperText>
          </FormControl>
        )
      case 'new':
        return (
          <FormControl
            component={'fieldset' as 'div'}
            fullWidth={true}
            error={this.props['data-errorText'] && this.props['data-errorText'].length > 0 ? true : false}
            required={this.props.required}
            className={this.props.className}>
            <FormLabel component={'legend' as 'label'}>{this.props['labelText']}</FormLabel>
            <RadioGroup
              aria-label={this.props['labelText']}
              name={this.props.name as string}
              value={this.state.value.toString()}
              onChange={this.handleChange as any}>
              {this.props.options.map(option => {
                return (
                  <FormControlLabel
                    key={option.Value}
                    value={option.Value.toString()}
                    control={<Radio />}
                    label={option.Text}
                    disabled={this.props.readOnly}
                  />
                )
              })}
            </RadioGroup>
            <FormHelperText>{this.props['hintText']}</FormHelperText>
            <FormHelperText>{this.props['data-errorText']}</FormHelperText>
          </FormControl>
        )
      case 'browse':
        return this.props['data-fieldValue'].length > 0 ? (
          <FormControl component={'fieldset' as 'div'} className={this.props.className}>
            <FormLabel component={'legend' as 'label'}>{this.props['labelText']}</FormLabel>
            <FormGroup>
              {this.props['data-fieldValue'].map((value: any, index: number) => (
                <FormControl key={index} component={'fieldset' as 'div'}>
                  <FormControlLabel
                    style={{ marginLeft: 0 }}
                    label={this.props.options.find(item => item.Value === value).Text}
                    control={<span />}
                    key={value}
                  />
                </FormControl>
              ))}
            </FormGroup>
          </FormControl>
        ) : null
      default:
        return this.props['data-fieldValue'].length > 0 ? (
          <FormControl component={'fieldset' as 'div'} className={this.props.className}>
            <FormLabel component={'legend' as 'label'}>{this.props['labelText']}</FormLabel>
            <FormGroup>
              {this.props['data-fieldValue'].map((value: any, index: number) => (
                <FormControl key={index} component={'fieldset' as 'div'}>
                  <FormControlLabel
                    style={{ marginLeft: 0 }}
                    label={this.props.options.find(item => item.Value === value).Text}
                    control={<span />}
                    key={value}
                  />
                </FormControl>
              ))}
            </FormGroup>
          </FormControl>
        ) : null
    }
  }
}
