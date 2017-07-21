/**
 * @module FieldControls
 * 
 *//** */
import * as React from 'react'
import { FieldSettings } from 'sn-client-js'
import { IClientFieldSetting, IReactClientFieldSetting } from '../IClientFieldSetting'
import { IChoiceFieldSetting } from '../IChoiceFieldSetting'

import { Input } from 'react-materialize'
import { styles } from './DropDownListStyles'

/**
 * Interface for DatePicker properties
 */
export interface DropDownListProps extends IReactClientFieldSetting, IClientFieldSetting, IChoiceFieldSetting { 
    onChange: Function
}

/**
 * Field control that represents a Choice field. Available values will be populated from the FieldSettings.
 */
export class DropDownList extends React.Component<DropDownListProps, {}> {
    /**
     * constructor
     * @param {object} props
     */
    constructor(props) {
        super(props);
        /**
         * @type {object}
         */
        this.state = {
        };
    }

    /**
     * returns selected options value
     */
    getSelectedValue() {
        let selected;
        this.props.options.map(function (option) {
            if (option.Selected) {
                 selected = option.Value
            }
        })
        return selected;
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
                    <Input
                        type='select'
                        label={
                            this.props.required
                                ? this.props['data-labelText'] + ' *'
                                : this.props['data-labelText']
                        }
                        multiple={this.props['data-allowMultiple']}
                        name={this.props.name}
                        defaultValue={this.getSelectedValue()}
                        error={this.props['data-errorText']}
                        onChange={this.props.onChange}
                        s={12}>
                        {this.props.options.map(function (option) {
                            return (
                                <option key={option.Value} value={option.Value} className='indent'>{option.Text}</option>
                            );
                        })}
                    </Input>
                )
            case 'new':
                return (
                    <Input
                        type='select'
                        label={
                            this.props.required
                                ? this.props['data-labelText'] + ' *'
                                : this.props['data-labelText']
                        }
                        multiple={this.props['data-allowMultiple']}
                        name={this.props.name}
                        defaultValue={this.props['data-defaultValue']}
                        error={this.props['data-errorText']}
                        onChange={this.props.onChange}
                        s={12}>
                        {this.props.options.map(function (option) {
                            return (
                                <option key={option.Value} value={option.Value} className='indent'>{option.Text}</option>
                            );
                        })}
                    </Input>
                );
            case 'browse':
                return (
                    <div>
                        <label>
                            {this.props['data-labelText']}
                        </label>
                        <div>
                            { this.getTextByValue(this.props['data-fieldValue'])}
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
                            { this.getTextByValue(this.props['data-fieldValue'])}
                        </div>
                    </div>
                )
        }
    }
}