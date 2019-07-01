/**
 * @module FieldControls
 */
import React, { Component } from 'react'

import Checkbox from '@material-ui/core/Checkbox'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormLabel from '@material-ui/core/FormLabel'
import TextField from '@material-ui/core/TextField'
import { ChoiceFieldSetting } from '@sensenet/default-content-types'
import { ReactClientFieldSetting } from './ClientFieldSetting'

// TODO(Zoli): Review this. It's value should be determind by the allowmultiple setting
/**
 * Interface for CheckboxGroup state
 */
export interface CheckboxGroupState {
  value: any
}
/**
 * Field control that represents a Choice field. Available values will be populated from the FieldSettings.
 */
export class CheckboxGroup extends Component<ReactClientFieldSetting<ChoiceFieldSetting>, CheckboxGroupState> {
  state: CheckboxGroupState = {
    value:
      (this.props.content && this.props.content[this.props.settings.Name]) || this.props.settings.DefaultValue || [],
  }
  /**
   * set selected value
   */
  public handleChange = (_event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    const { value } = this.state
    const index = value.indexOf(checked)
    if (this.props.settings.AllowMultiple) {
      if (index > -1) {
        value.splice(index, 1)
      } else {
        value.push(checked)
      }
    } else {
      if (index > -1) {
        value.splice(index, 1)
      } else {
        value[0] = checked
      }
    }
    this.setState({
      value: checked,
    })
    this.props.fieldOnChange && this.props.fieldOnChange(this.props.settings.Name, checked)
  }
  /**
   * returns if an item is checked or not
   * @param {string} item
   */
  public isChecked(item: number | string) {
    let checked = false
    for (let i = 0; i < this.state.value.length; i++) {
      if (this.state.value[i].toString() === item.toString()) {
        checked = true
        break
      }
    }
    return checked
  }
  /**
   * render
   * @return {ReactElement} markup
   */
  public render() {
    const options = this.props.settings.Options || []
    switch (this.props.actionName) {
      case 'edit':
        return (
          <FormControl component={'fieldset' as 'div'} required={this.props.settings.Compulsory}>
            <FormLabel component={'legend' as 'label'}>{this.props.settings.DisplayName}</FormLabel>
            <FormGroup>
              {options.map(option => {
                return (
                  <FormControlLabel
                    key={option.Value}
                    control={
                      <Checkbox
                        checked={this.isChecked(option.Value)}
                        onChange={this.handleChange}
                        value={option.Value.toString()}
                        disabled={this.props.settings.ReadOnly}
                      />
                    }
                    label={option.Text}
                  />
                )
              })}
            </FormGroup>
            {this.props.settings.AllowExtraValue ? <TextField placeholder="Extra value" /> : null}
            <FormHelperText>{this.props.settings.Description}</FormHelperText>
          </FormControl>
        )
      case 'new':
        return (
          <FormControl component={'fieldset' as 'div'} required={this.props.settings.Compulsory}>
            <FormLabel component={'legend' as 'label'}>{this.props.settings.DisplayName}</FormLabel>
            <FormGroup>
              {options.map(option => {
                return (
                  <FormControlLabel
                    key={option.Value}
                    control={
                      <Checkbox
                        checked={this.isChecked(option.Value)}
                        onChange={this.handleChange}
                        value={option.Value.toString()}
                        disabled={this.props.settings.ReadOnly}
                      />
                    }
                    label={option.Text}
                  />
                )
              })}
            </FormGroup>
            {this.props.settings.AllowExtraValue ? <TextField placeholder="Extra value" /> : null}
            <FormHelperText>{this.props.settings.Description}</FormHelperText>
          </FormControl>
        )
      case 'browse':
      default: {
        const value = this.props.content && this.props.content[this.props.settings.Name]
        return value ? (
          <FormControl component={'fieldset' as 'div'}>
            <FormLabel component={'legend' as 'label'}>{this.props.settings.DisplayName}</FormLabel>
            <FormGroup>
              {Array.isArray(value) ? (
                value.map((val: any, index: number) => (
                  <FormControl component={'fieldset' as 'div'} key={index}>
                    <FormControlLabel
                      style={{ marginLeft: 0 }}
                      label={this.props.settings.Options!.find(item => item.Value === val)!.Text}
                      control={<span />}
                      key={val}
                    />
                  </FormControl>
                ))
              ) : (
                <FormControl component={'fieldset' as 'div'}>
                  <FormControlLabel
                    style={{ marginLeft: 0 }}
                    label={this.props.settings.Options!.find(item => item.Value === value)!.Text}
                    control={<span />}
                  />
                </FormControl>
              )}
            </FormGroup>
          </FormControl>
        ) : null
      }
    }
  }
}
