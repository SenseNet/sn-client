/**
 * @module FieldControls
 */
import React, { Component } from 'react'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormLabel from '@material-ui/core/FormLabel'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import { ChoiceFieldSetting, GenericContent } from '@sensenet/default-content-types'
import { ReactClientFieldSetting } from './ClientFieldSetting'

/**
 * Interface for DropDownList state
 */
export interface DropDownListState<T extends GenericContent, K extends keyof T> {
  value: T[K]
}
/**
 * Field control that represents a Choice field. Available values will be populated from the FieldSettings.
 */
export class DropDownList<T extends GenericContent, K extends keyof T> extends Component<
  ReactClientFieldSetting<ChoiceFieldSetting>,
  DropDownListState<T, K>
> {
  /**
   * constructor
   * @param {object} props
   */
  constructor(props: DropDownList<T, K>['props']) {
    super(props)
    /**
     * @type {object}
     */
    this.state = {
      value:
        (this.props.content && this.props.content[this.props.settings.Name]) || this.props.settings.DefaultValue || [],
    }
  }
  /**
   * sets the selected value in the state
   */
  public handleChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    this.setState({ value: event.target.value as any })
    this.props.fieldOnChange && this.props.fieldOnChange(this.props.settings.Name, event.target.value as any)
  }
  /**
   * returns selected options value
   */
  public getSelectedValue() {
    let selected
    this.props.settings.Options!.map(option => {
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
  public getTextByValue(value: any) {
    if (value) {
      this.props.settings.Options!.map(option => {
        if (option.Value === value.toString()) {
          return option.Text
        }
      })
    } else {
      this.props.settings.Options!.map(option => {
        if (option.Selected) {
          return option.Text
        }
      })
    }
  }

  /**
   * render
   * @return {ReactElement} markup
   */
  public render() {
    switch (this.props.actionName) {
      case 'edit':
        return (
          <FormControl fullWidth={true} required={this.props.settings.Compulsory}>
            <InputLabel htmlFor={this.props.settings.Name as string}>{this.props.settings.DisplayName}</InputLabel>
            <Select
              onChange={this.handleChange}
              inputProps={
                {
                  name: this.props.settings.Name,
                  id: this.props.settings.Name,
                } as any
              }
              value={this.state.value[0]}
              multiple={this.props.settings.AllowMultiple}
              autoWidth={true}
              fullWidth={true}>
              {this.props.settings.Options!.map(option => {
                return (
                  <MenuItem key={option.Value} value={option.Value}>
                    {option.Text}
                  </MenuItem>
                )
              })}
            </Select>
            <FormHelperText>{this.props.settings.Description}</FormHelperText>
          </FormControl>
        )
      case 'new':
        return (
          <FormControl fullWidth={true} required={this.props.settings.Compulsory}>
            <InputLabel htmlFor={this.props.settings.Name as string}>{this.props.settings.DisplayName}</InputLabel>
            <Select
              onChange={this.handleChange}
              inputProps={
                {
                  name: this.props.settings.Name,
                  id: this.props.settings.Name,
                } as any
              }
              value={this.state.value as any}
              multiple={this.props.settings.AllowMultiple}
              autoWidth={true}
              fullWidth={true}>
              {this.props.settings.Options!.map(option => {
                return (
                  <MenuItem key={option.Value} value={option.Value}>
                    {option.Text}
                  </MenuItem>
                )
              })}
            </Select>
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
