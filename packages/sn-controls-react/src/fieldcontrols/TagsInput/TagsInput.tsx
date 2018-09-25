/**
 * @module FieldControls
 *
 */ /** */
import Chip from '@material-ui/core/Chip'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { PathHelper } from '@sensenet/client-utils'
import { MaterialIcon } from '@sensenet/icons-react'
import * as React from 'react'
import Select from 'react-select'
import { ReactClientFieldSetting, ReactClientFieldSettingProps } from '../ClientFieldSetting'
import { ReactReferenceFieldSetting } from '../ReferenceFieldSetting'
import { Option } from './TagsInputOptions'
import { styles } from './TagsInputStyles'

import './TagsInput.css'

import { IContent, IODataCollectionResponse } from '@sensenet/client-core'

/**
 * Interface for TagsInput properties
 */
export interface TagsInputProps extends ReactClientFieldSettingProps, ReactClientFieldSetting, ReactReferenceFieldSetting { }

/**
 * Field control that represents a Reference field. Available values will be populated from the FieldSettings.
 */
export class TagsInput extends React.Component<TagsInputProps, { label, multiLabel, dataSource, fieldValue }> {
    /**
     * constructor
     * @param {object} props
     */
    constructor(props) {
        super(props)
        /**
         * @type {object}
         * @property {any[]} chips array of chips input value
         * @property {any[]} dataSource array of data for autocomplete
         */
        this.state = {
            dataSource: [],
            label: this.props['data-defaultDisplayName'],
            multiLabel: null,
            fieldValue: null,
        }
        this.search = this.search.bind(this)
        this.search()
        this.getSelected = this.getSelected.bind(this)
        if (this.props['data-actionName'] === 'edit') {
            this.getSelected()
            this.handleChange = this.handleChange.bind(this)
        }
    }
    /**
     * handles input changes
     */
    public handleChange = (name) => (value) => {
        const ids = value.length > 0 ? value.split(',') : []
        const saveable = ids.map((id) => parseInt(id, 10))
        this.setState({
            [name]: value,
            fieldValue: ids,
        } as any)
        this.props.onChange(this.props.name, saveable)
    }
    /**
     * handles selection
     */
    public selectWrapped = (props) => {
        const { ...other } = props
        return <Select
            optionComponent={Option}
            noResultsText={<Typography>{'No results found'}</Typography>}
            arrowRenderer={(arrowProps) => {
                return arrowProps.isOpen ? <MaterialIcon iconName="ArrowDropUpIcon" /> : <MaterialIcon iconName="ArrowDropDownIcon" />
            }}
            clearRenderer={() => <MaterialIcon iconName="ClearIcon" />}
            valueComponent={(valueProps) => {
                const { value, children, onRemove } = valueProps

                const onDelete = (event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    onRemove(value)
                }

                if (onRemove) {
                    return (
                        <Chip
                            tabIndex={-1}
                            label={children}
                            // className={classes.chip}
                            deleteIcon={<MaterialIcon iconName="CancelIcon" onClick={onDelete} />}
                            onDelete={onDelete}
                        />
                    )
                }

                return <div className="Select-value">{children}</div>
            }}
            {...other}
        />
    }
    /**
     * returns referencefields' datasource
     * @param path
     */
    public async search(): Promise<IODataCollectionResponse<IContent>> {
        const selectionRoot = this.props['data-selectionRoot']
        const allowedTypes = this.props['data-allowedTypes']
        let pathQuery = ''
        selectionRoot.map((selectionPath, index) => {
            pathQuery += index === 0 ? `InTree:${selectionPath}` : `OR InTree:${selectionPath}`
        })
        let typeQuery = ''
        allowedTypes.map((type) => {
            typeQuery += ` +TypeIs:${type}`
        })
        const req = await this.props['data-repository'].loadCollection({
            path: '/Root',
            oDataOptions: {
                query: `(${pathQuery}) AND${typeQuery}`,
                select: 'all',
            },
        })
        const { label } = this.state
        this.setState({
            dataSource: req.d.results.map((suggestion) => ({
                // tslint:disable-next-line:no-string-literal
                value: suggestion['Id'],
                label: suggestion[label],
            })),
        })
        return req
    }
    /**
     * getSelected
     * @return {any[]}
     */
    public async getSelected() {
        // tslint:disable-next-line:no-string-literal
        const loadPath = PathHelper.joinPaths(PathHelper.getContentUrl(this.props['content'].Path), '/', this.props.name)
        const references = await this.props['data-repository'].loadCollection({
            path: loadPath,
            oDataOptions: {
                select: 'all',
            },
        })
        const { label } = this.state
        this.setState({
            fieldValue: references.d.results.map((item) => ({
                // tslint:disable-next-line:no-string-literal
                value: item['Id'],
                label: item[label],
            })),
        })
        return references
    }
    /**
     * render
     * @return {ReactElement} markup
     */
    public render() {
        switch (this.props['data-actionName']) {
            case 'edit':
                return (
                    <div style={styles.container} className="col input-field s12">
                        <TextField
                            fullWidth
                            value={this.state.multiLabel}
                            onChange={this.handleChange('multiLabel')}
                            placeholder={this.props['data-placeHolderText']}
                            name="react-select-chip-label"
                            label={this.props['data-labelText']}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            InputProps={{
                                inputComponent: this.selectWrapped,
                                inputProps: {
                                    multi: true,
                                    instanceId: 'react-select-chip-label',
                                    id: 'react-select-chip-label',
                                    simpleValue: true,
                                    options: this.state.dataSource,
                                    value: this.state.fieldValue,
                                },
                            }}
                        />
                    </div>
                )
            case 'new':
                return (
                    <div style={styles.container} className="col input-field s12">
                        <TextField
                            fullWidth
                            value={this.state.multiLabel}
                            onChange={this.handleChange('multiLabel')}
                            placeholder={this.props['data-placeHolderText']}
                            name="react-select-chip-label"
                            label={this.props['data-labelText']}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            InputProps={{
                                inputComponent: this.selectWrapped,
                                inputProps: {
                                    multi: true,
                                    instanceId: 'react-select-chip-label',
                                    id: 'react-select-chip-label',
                                    simpleValue: true,
                                    options: this.state.dataSource,
                                },
                            }}
                        />
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
