/**
 * @module FieldControls
 * 
 */ /** */
import * as React from 'react'
import { FieldSettings } from 'sn-client-js'
import { IClientFieldSetting, IReactClientFieldSetting } from '../IClientFieldSetting'
import { IChoiceFieldSetting } from '../IChoiceFieldSetting'

import { Input } from 'react-materialize'
import { styles } from './CheckboxGroupStyles'

/**
 * Interface for CheckboxGroup properties
 */
export interface CheckboxGroupProps extends IReactClientFieldSetting, IClientFieldSetting, IChoiceFieldSetting { 
    onChange: Function
}

/**
 * Field control that represents a Choice field. Available values will be populated from the FieldSettings.
 */
export class CheckboxGroup extends React.Component<CheckboxGroupProps, {}> {
    /**
     * constructor
     * @param {object} props
     */
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    /**
     * returns selected options value
     */
    getSelectedValue() {
        this.props.options.map(function (option) {
            if (option.Selected) {
                return option.Value
            }
        })
    }
    /**
     * returns selected options text by its value
     * @param {any} value
     */
    getTextByValue(value) {
        let text = '';
        if (value) {
            this.props.options.map(function (option) {
                if (option.Value === value.toString()) {
                    text = option.Text
                }
            })
        }
        else {
            this.props.options.map(function (option) {
            if (option.Selected) {
                text = option.Text
            }
        })
        }
        return text;
    }
    /**
     * render
     * @return {ReactElement} markup
     */
    render() {
        switch (this.props['data-actionName']) {
            case 'edit':
                return (
                    <span>under consctruction</span>
                )
            case 'new':
                return (
                    <span>under consctruction</span>
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