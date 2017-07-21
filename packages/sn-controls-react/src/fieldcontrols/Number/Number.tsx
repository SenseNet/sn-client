/**
 * @module FieldControls
 * 
 */ /** */
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { FieldSettings } from 'sn-client-js'
import { IClientFieldSetting, IReactClientFieldSetting } from '../IClientFieldSetting'
import { INumberFieldSetting } from './INumberFieldSetting'

import { Input, Icon } from 'react-materialize'
import { style } from './NumberStyles'
import './NumberStyles.css';
import Radium from 'radium'

/**
 * Interface for Number properties
 */
export interface NumberProps extends IReactClientFieldSetting, IClientFieldSetting, INumberFieldSetting { 
    onChange: Function
}

/**
 * Field control that represents a Number field. Available values will be populated from the FieldSettings.
 */
@Radium
export class Number extends React.Component<NumberProps, { value }> {

    constructor(props) {
        super(props);
        this.state = {
            value: this.props['data-fieldValue'] ? this.setValue(this.props['data-fieldValue']) : this.setValue(this.props['data-defaultValue'])
        };
    }
    /**
     * convert incoming default value string to proper format
     * @param {string} value
     */
    setValue(value) {
        if (value) {
            return value;
        }
        else {
            if (this.props['data-defaultValue']) {
                return this.props['data-defaultValue']
            }
            else {
                return null
            }
        }
    }

    //TODO: integer, decimal+digits
    /**
     * returns whether the value is valid or not
     * @param {number} value
     */
    isValid(value) {
        return value > this.props.min && value < this.props.max;
    }
    /**
     * is invoked immediately after a component is mounted. Initialization that requires DOM nodes should go here. 
     * If you need to load data from a remote endpoint, this is a good place to instantiate the network request. 
     * Setting state in this method will trigger a re-rendering.
    */
    componentDidMount() {
        if (this.refs[this.props.name]) {
            let input = ReactDOM.findDOMNode(this.refs[this.props.name]).getElementsByTagName('input')[0];
            if (this.isValid(input.value)) {
                input.setAttribute('class', 'validate');
            }
        }
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
                        name={this.props.name}
                        ref={this.props.name}
                        type='number'
                        label={
                            this.props.required
                                ? this.props['data-labelText'] + ' *'
                                : this.props['data-labelText']
                        }
                        className={this.props.className}
                        //placeholder={this.props['data-placeHolderText']}
                        //placeHolderStyle?: object
                        style={this.props.style}
                        defaultValue={this.state.value}
                        readOnly={this.props.readOnly}
                        min={this.props.min}
                        max={this.props.max}
                        step={this.props['data-step'] ? this.props['data-step'] : 'any'}
                        required={this.props.required}
                        disabled={this.props.readOnly}
                        error={this.props['data-']}
                        onChange={this.props.onChange}
                        validate
                        s={12}
                        m={12}
                        l={12}
                    >
                        <Icon className='numbericon'>%</Icon>
                    </Input>
                )
            case 'new':
                return (
                    <Input
                        name={this.props.name}
                        ref={this.props.name}
                        type='number'
                        label={
                            this.props.required
                                ? this.props['data-labelText'] + ' *'
                                : this.props['data-labelText']
                        }
                        className={this.props.className}
                        //placeholder={this.props['data-placeHolderText']}
                        //placeHolderStyle?: object
                        style={this.props.style}
                        defaultValue={this.state.value}
                        readOnly={this.props.readOnly}
                        step={this.props['data-step'] ? this.props['data-step'] : 'any'}
                        min={this.props.min}
                        max={this.props.max}
                        required={this.props.required}
                        disabled={this.props.readOnly}
                        onChange={this.props.onChange}
                        validate
                        s={12}
                        m={12}
                        l={12}
                    >
                        <Icon className='numbericon'>%</Icon>
                    </Input>
                )
            case 'browse':
                return (
                    <div>
                        <label>
                            {this.props['data-labelText']}
                        </label>
                        <p>
                            {this.props['data-fieldValue']}
                            {this.props['data-isPercentage'] ? '%' : ''}
                        </p>
                    </div>
                )
            default:
                return (
                    <div>
                        <label>
                            {this.props['data-labelText']}
                        </label>
                        <p>
                            {this.props['data-fieldValue']}
                            {this.props['data-isPercentage'] ? '%' : ''}
                        </p>
                    </div>
                )
        }

    }
}