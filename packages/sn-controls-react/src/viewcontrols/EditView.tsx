/**
 * @module ViewControls
 *
 */ /** */
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import React, { Component, createElement } from 'react'
import MediaQuery from 'react-responsive'
import { reactControlMapper } from '../ReactControlMapper'
import { styles } from './EditViewStyles'

/**
 * Interface for EditView properties
 */
export interface EditViewProps {
    content,
    onSubmit?,
    repository,
    schema?,
    contentTypeName,
    columns?: boolean,
    handleCancel?,
    submitCallback?,
}

/**
 * View Control for editing a Content, works with a single Content and based on the ReactControlMapper
 *
 * Usage:
 * ```html
 *  <EditView content={selectedContent} onSubmit={editSubmitClick} />
 * ```
 */
export class EditView extends Component<EditViewProps, { content, schema }> {
    /**
     * property
     * @property {string} displayName
     */
    protected displayName: string
    /**
     * constructor
     * @param {object} props
     */
    constructor(props: any) {
        super(props)
        /**
         * @type {object}
         * @property {any} content selected Content
         * @property {any} schema schema object of the selected Content's Content Type
         */
        const controlMapper = reactControlMapper(this.props.repository)
        this.state = {
            content: this.props.content,
            schema: controlMapper.getFullSchemaForContentType(this.props.contentTypeName as any, 'edit'),
        }

        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleCancel = this.handleCancel.bind(this)

        this.displayName = this.props.content.DisplayName
    }

    /**
     * handle cancle button click
     */
    public handleCancel() {
        return this.props.handleCancel ? this.props.handleCancel() : null
    }
    /**
     * handle change event on an input
     * @param {SytheticEvent} event
     */
    public handleInputChange(field, value) {
        this.state.content[field] = value

        this.setState({
            content: this.props.content,
        })
    }
    /**
     * eturns a value of an input
     * @param {string} name name of the input
     * @return {any} value of the input or null
     */
    public getFieldValue(name) {
        if (this.props.content[name]) {
            return this.props.content[name]
        } else {
            return false
        }
    }
    /**
     * render
     * @return {ReactElement} markup
     */
    public render() {
        const fieldSettings = this.state.schema.fieldMappings
        const that = this
        const { columns } = that.props
        return (
            <form style={styles.container} onSubmit={
                (e) => {
                    e.preventDefault()
                    if (this.props.onSubmit) {
                        this.props.onSubmit(this.state.content.Id, this.props.content)
                    }
                    return this.props.submitCallback ? this.props.submitCallback() : null
                }
            }>
                <Grid container spacing={24}>
                    {
                        fieldSettings.map((e, i) => {
                            if (fieldSettings[i].clientSettings['data-typeName'] === 'ReferenceFieldSetting') {
                                fieldSettings[i].clientSettings['data-repository'] = this.props.repository
                            }
                            return (<Grid item xs={12}
                                sm={12}
                                md={fieldSettings[i].clientSettings['data-typeName'] === 'LongTextFieldSetting' || !columns ? 12 : 6}
                                lg={fieldSettings[i].clientSettings['data-typeName'] === 'LongTextFieldSetting' || !columns ? 12 : 6}
                                xl={fieldSettings[i].clientSettings['data-typeName'] === 'LongTextFieldSetting' || !columns ? 12 : 6}
                                key={fieldSettings[i].clientSettings.name}>
                                {
                                    createElement(
                                        fieldSettings[i].controlType,
                                        {
                                            ...fieldSettings[i].clientSettings,
                                            'data-actionName': 'edit',
                                            'data-fieldValue': that.getFieldValue(fieldSettings[i].clientSettings.name),
                                            'onChange': that.handleInputChange,
                                            'content': this.state.content,
                                            'value': that.getFieldValue(fieldSettings[i].clientSettings.name),
                                        })
                                }
                            </Grid>)

                        })
                    }
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ textAlign: 'right' }}>
                        <MediaQuery minDeviceWidth={700}>
                            {(matches) =>
                                matches ? <Button color="default" style={{ marginRight: 20 }} onClick={() => this.handleCancel()}>Cancel</Button> : null
                            }
                        </MediaQuery>
                        <Button type="submit" variant="raised" color="secondary">Submit</Button>
                    </Grid>
                </Grid >
            </form>
        )
    }
}
