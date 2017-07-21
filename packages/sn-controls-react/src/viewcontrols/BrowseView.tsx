/**
 * @module ViewControls
 * 
 *//** */
import * as React from 'react'
import { ReactControlMapper } from '../ReactControlMapper'
import { Row, Col } from 'react-materialize'
import { styles } from './BrowseViewStyles'

/**
 * Interface for BrowseView properties
 */
interface IBrowseViewProps {
    content
}

/**
 * View Control for browsing a Content, works with a single Content and based on the ReactControlMapper
 * 
 * Usage:
 * ```html
 *  <BrowseView content={content} />
 * ```
 */
export class BrowseView extends React.Component<IBrowseViewProps, { content, schema }> {
    /**
     * constructor
     * @param {object} props
     */
    constructor(props: any) {
        super(props);
        /**
         * @type {object}
         * @property {any} content selected Content
         * @property {any} schema schema object of the selected Content's Content Type
         */
        this.state = {
            content: this.props.content,
            schema: ReactControlMapper.GetFullSchemaForContent(this.props.content as any, 'edit')
        };
    }
    /**
     * returns a value of an input
     * @param {string} name name of the input
     * @return {any} value of the input or null
     */
    getFieldValue(name) {
        if (this.props.content[name]) {
            return this.props.content[name]
        }
        else {
            return null
        }
    }
    /**
     * render
     * @return {ReactElement} markup
     */
    render() {
        const fieldSettings = this.state.schema.FieldMappings;
        const that = this;
        return (
            <Row>
                <div style={styles.container}>
                    <h4>{this.props.content.DisplayName}</h4>
                    {
                        fieldSettings.map(function (e, i) {
                            return (
                                <Col s={12} m={12} l={12} key={fieldSettings[i].ClientSettings.name}>
                                    {
                                        React.createElement(
                                            fieldSettings[i].ControlType,
                                            {
                                                ...fieldSettings[i].ClientSettings,
                                                'data-actionName': 'browse',
                                                'data-fieldValue': that.getFieldValue(fieldSettings[i].ClientSettings.name)
                                            })
                                    }
                                </Col>)

                        })
                    }
                </div>
            </Row>
        )
    }
}