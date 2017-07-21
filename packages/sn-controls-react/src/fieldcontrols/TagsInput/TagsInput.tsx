/**
 * @module FieldControls
 * 
 */ /** */
import * as React from 'react'
import { FieldSettings } from 'sn-client-js'
import { IClientFieldSetting, IReactClientFieldSetting } from '../IClientFieldSetting'
import { IReferenceFieldSetting } from '../IReferenceFieldSetting'

import ChipInput from 'material-ui-chip-input'
import { styles } from './TagsInputStyles'
import * as mui from 'material-ui';
import { Col } from 'react-materialize'
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { MuiThemeProvider, lightBaseTheme } from 'material-ui/styles';
const lightMuiTheme = getMuiTheme(lightBaseTheme);

import * as injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();


/**
 * Interface for TagsInput properties
 */
export interface TagsInputProps extends IReactClientFieldSetting, IClientFieldSetting, IReferenceFieldSetting { }

/**
 * Field control that represents a Reference field. Available values will be populated from the FieldSettings.
 */
export class TagsInput extends React.Component<TagsInputProps, { chips, dataSource }> {
    /**
     * constructor
     * @param {object} props
     */
    constructor(props) {
        super(props);
        /**
         * @type {object}
         * @property {any[]} chips array of chips input value
         * @property {any[]} dataSource array of data for autocomplete
         */
        this.state = {
            chips: [],
            //dataSource: this.getDataSource(this.props['data-selectionRoot'])
            dataSource: ['foo', 'bar']
        };
    }

    /**
     * returns datasource arra by paths
     * @param {string} paths
     */
    getDataSource(paths) {
        let data = [];
        return data;
    }

    /**
     * handle change event on an input
     * @param {SytheticEvent} event
     */
    handleChange(event) {

    }
    /**
     * handle add event on an input
     * @param {any[]} chips
     */
    handleRequestAdd(...chips) {
        this.setState({
            chips: [...this.state.chips, ...chips]
        })

    }
    /**
     * handle delete event on an input
     * @param {any} deletedChip
     */
    handleRequestDelete(deletedChip) {
        this.setState({
            chips: this.state.chips.filter((c) => c !== deletedChip)
        })
    }
    /**
     * chip renderer
     * @param {SytheticEvent} event
     */
    chipRenderer() { }
    /**
     * render
     * @return {ReactElement} markup
     */
    render() {
        switch (this.props['data-actionName']) {
            case 'edit':
                return (
                    <div style={styles.container} className='col input-field s12'>
                        <MuiThemeProvider muiTheme={lightMuiTheme}>
                            <ChipInput
                                floatingLabelText={
                                    this.props.required
                                        ? this.props['data-labelText'] + ' *'
                                        : this.props['data-labelText']
                                }
                                defaultValue={['foo', 'bar']}
                                onRequestAdd={(chip) => this.handleRequestAdd(chip)}
                                onRequestDelete={(deletedChip) => this.handleRequestDelete(deletedChip)}
                                fullWidth
                                allowDuplicates={false}
                                dataSource={this.props.dataSource}
                                disabled={this.props.readOnly}
                                errorText={this.props['data-errorText']}
                                hintText={this.props['data-labelText']}
                                id={this.props.name}
                                style={{ ...this.props.style, ...styles.chipContainerStyle }}
                                value={this.state.chips}
                                chipRenderer={
                                    this.chipRenderer

                                }
                            />
                        </MuiThemeProvider>
                    </div>
                )
            case 'new':
                return (
                    <div style={styles.container} className='col input-field s12'>
                        <MuiThemeProvider muiTheme={lightMuiTheme}>
                            <ChipInput
                                floatingLabelText={
                                    this.props.required
                                        ? this.props['data-labelText'] + ' *'
                                        : this.props['data-labelText']
                                }
                                defaultValue={['foo', 'bar']}
                                onRequestAdd={(chip) => this.handleRequestAdd(chip)}
                                onRequestDelete={(deletedChip) => this.handleRequestDelete(deletedChip)}
                                fullWidth
                                allowDuplicates={false}
                                dataSource={this.props.dataSource}
                                disabled={this.props.readOnly}
                                errorText={this.props['data-errorText']}
                                hintText={this.props['data-labelText']}
                                id={this.props.name}
                                style={{ ...this.props.style, ...styles.chipContainerStyle }}
                                value={this.state.chips}
                                chipRenderer={
                                    this.chipRenderer

                                }
                            />
                        </MuiThemeProvider>
                    </div>
                )
            case 'browse':
                return (
                    <div>
                        <label>
                            {this.props['data-labelText']}
                        </label>
                        <p>
                            {this.props['data-fieldValue']}
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
                        </p>
                    </div>
                )
        }
    }
}