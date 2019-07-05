/**
 * @module FieldControls
 */
import Checkbox from '@material-ui/core/Checkbox'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import InputLabel from '@material-ui/core/InputLabel'
import React, { Component } from 'react'
import { FieldSetting } from '@sensenet/default-content-types'
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
export class BooleanComponent extends Component<ReactClientFieldSetting<FieldSetting>, BooleanState> {
  state = {
    value: this.props.fieldValue != null ? !!this.props.fieldValue : !!this.props.settings.DefaultValue,
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
    this.props.fieldOnChange && this.props.fieldOnChange(this.props.settings.Name, newValue)
  }
  /**
   * render
   * @return {ReactElement} markup
   */
  public render() {
    switch (this.props.actionName) {
      case 'edit':
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
        return this.props.fieldValue != null ? (
          <FormControl component={'fieldset' as 'div'}>
            <InputLabel shrink={true} htmlFor={this.props.settings.Name}>
              {this.props.settings.DisplayName}
            </InputLabel>
            {this.props.renderIcon
              ? this.props.renderIcon(this.props.fieldValue ? 'check' : 'not_interested')
              : renderIconDefault(this.props.fieldValue ? 'check' : 'not_interested')}
          </FormControl>
        ) : null
    }
  }
}
