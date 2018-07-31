/**
 * @module ViewControls
 *
 *//** */
import Grid from '@material-ui/core/Grid'
import * as React from 'react'
import { reactControlMapper } from '../ReactControlMapper'
import { styles } from './BrowseViewStyles'

/**
 * Interface for BrowseView properties
 */
export interface BrowseViewProps {
    content,
    repository,
}

/**
 * View Control for browsing a Content, works with a single Content and based on the ReactControlMapper
 *
 * Usage:
 * ```html
 *  <BrowseView content={content} />
 * ```
 */
export class BrowseView extends React.Component<BrowseViewProps, { content, schema }> {
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
            schema: controlMapper.getFullSchemaForContentType(this.props.content as any, 'edit'),
        }
    }
    /**
     * returns a value of an input
     * @param {string} name name of the input
     * @return {any} value of the input or null
     */
    public getFieldValue(name) {
        if (this.props.content[name]) {
            return this.props.content[name]
        } else {
            return null
        }
    }
    /**
     * render
     * @return {ReactElement} markup
     */
    public render() {
        const fieldSettings = this.state.schema.fieldMappings
        const that = this
        return (
            <Grid container spacing={24}>
                <div style={styles.container}>
                    <h4>{this.props.content.DisplayName}</h4>
                    {
                        fieldSettings.map((e, i) => {
                            return (
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    {
                                        React.createElement(
                                            fieldSettings[i].controlType,
                                            {
                                                ...fieldSettings[i].clientSettings,
                                                'data-actionName': 'browse',
                                                'data-fieldValue': that.getFieldValue(fieldSettings[i].clientSettings.name),
                                            })
                                    }
                                </Grid>)

                        })
                    }
                </div>
            </Grid>
        )
    }
}
