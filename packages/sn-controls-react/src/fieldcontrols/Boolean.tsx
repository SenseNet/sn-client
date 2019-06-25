/**
 * @module FieldControls
 */
import Checkbox from '@material-ui/core/Checkbox'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import InputLabel from '@material-ui/core/InputLabel'
import React, { Component } from 'react'
import { ReactClientFieldSetting } from './ClientFieldSetting'
import { renderIconDefault } from './icon'

/**
 * Interface for Boolean state
 */
export interface BooleanState {
  value: boolean
}

/**
 * Field control that represents a Choice field. Available values will be populated from the FieldSettings.
 */
export class Boolean extends Component<ReactClientFieldSetting, BooleanState> {
  /**
   * constructor
   * @param {object} props
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  constructor(props: Boolean['props']) {
    super(props)
    this.state = {
      value: this.props.content[this.props.settings.Name] || this.props.settings.DefaultValue || false,
    }
    this.handleChange = this.handleChange.bind(this)
  }
  /**
   * set selected value
   */
  public handleChange = () => {
    const { value } = this.state
    const newValue = !value
    this.setState({
      value: newValue,
    })
    this.props.fieldOnChange && this.props.fieldOnChange(this.props.settings.Name, newValue as any)
  }
  /**
   * render
   * @return {ReactElement} markup
   */
  public render() {
    switch (this.props.actionName) {
      case 'edit':
        return (
          <FormControl component={'fieldset' as 'div'} required={this.props.settings.Compulsory}>
            <FormControlLabel
              control={<Checkbox checked={this.state.value} onChange={this.handleChange} />}
              label={this.props.settings.DisplayName}
            />
            {this.props.settings.Description ? (
              <FormHelperText>{this.props.settings.Description}</FormHelperText>
            ) : null}
          </FormControl>
        )
      case 'new':
        return (
          <FormControl required={this.props.settings.Compulsory}>
            <FormControlLabel
              control={<Checkbox checked={this.state.value} onChange={this.handleChange} />}
              label={this.props.settings.DisplayName}
            />
            {this.props.settings.Description ? (
              <FormHelperText>{this.props.settings.Description}</FormHelperText>
            ) : null}
          </FormControl>
        )
      case 'browse':
      default:
        return this.props.content[this.props.settings.Name] != undefined ? (
          <FormControl component={'fieldset' as 'div'}>
            <InputLabel shrink={true} htmlFor={name as string}>
              {this.props.settings.DisplayName}
            </InputLabel>
            {this.props.renderIcon
              ? this.props.renderIcon(this.state.value ? 'check' : 'not_interested')
              : renderIconDefault(this.state.value ? 'check' : 'not_interested')}
          </FormControl>
        ) : null
    }
  }
}
