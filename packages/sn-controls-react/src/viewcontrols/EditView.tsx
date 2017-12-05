/**
 * @module ViewControls
 * 
 */ /** */
import * as React from 'react'
import { Content, ContentTypes } from 'sn-client-js'
import { ReactControlMapper } from '../ReactControlMapper'

import { Row, Button, Col } from 'react-materialize'
import { styles } from './EditViewStyles'

/**
 * Interface for EditView properties
 */
interface IEditViewProps {
    content: Content,
    history?,
    onSubmit?: Function
}

/**
 * View Control for editing a Content, works with a single Content and based on the ReactControlMapper
 * 
 * Usage:
 * ```html
 *  <EditView content={selectedContent} history={history} onSubmit={editSubmitClick} />
 * ```
 */
export class EditView extends React.Component<IEditViewProps, { content, schema }> {
    DisplayName: string;
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

        this.handleInputChange = this.handleInputChange.bind(this);

        this.DisplayName = this.props.content.DisplayName;
    }

    /**
     * handle change event on an input
     * @param {SytheticEvent} event
     */
    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.state.content[name] = value;

        this.setState({
            content: this.props.content
        });
    }
    /**
     * eturns a value of an input
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
                <form style={styles.container} onSubmit={
                    (e) => {
                        e.preventDefault();
                        if (this.props.onSubmit) {
                            this.props.onSubmit(this.state.content)
                        }
                        if (this.props.history) {
                            this.props.history.goBack()
                        }
                        else {
                            window.history.back();
                        }
                    }
                }>
                    <h4>Edit {this.DisplayName}</h4>
                    {
                        fieldSettings.map(function (e, i) {
                            return (<Col
                                s={12}
                                m={fieldSettings[i].ControlType.name === 'RichTextEditor' ? 12 : 6}
                                l={fieldSettings[i].ControlType.name === 'RichTextEditor' ? 12 : 6}
                                key={fieldSettings[i].ClientSettings.name}>
                                {
                                    React.createElement(
                                        fieldSettings[i].ControlType,
                                        {
                                            ...fieldSettings[i].ClientSettings,
                                            'data-actionName': 'edit',
                                            'data-fieldValue': that.getFieldValue(fieldSettings[i].ClientSettings.name),
                                            onChange: that.handleInputChange
                                        })
                                }
                            </Col>)

                        })
                    }
                    <Col s={12} m={12} l={12} style={styles.buttonContainer}>
                        <Button waves='light'>Submit</Button>
                        <Button waves='light'>Cancel</Button>
                    </Col >
                </form>
            </Row >
        )
    }
}
