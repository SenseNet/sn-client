/**
 * @module ViewControls
 * 
 */ /** */
import * as React from 'react'
import { Content } from 'sn-client-js'
import {
    CheckboxGroup,
    DatePicker,
    DropDownList,
    Number,
    RadioButtonGroup,
    ShortText,
    TagsInput
} from '../fieldcontrols'

import { Row, Button, Col } from 'react-materialize'
import { ReactControlMapper } from '../ReactControlMapper'
import { styles } from './NewViewStyles'

/**
 * Interface for NewView properties
 */
interface INewViewProps {
    content: Content,
    history?,
    onSubmit?: Function
}

/**
 * View Control for adding a Content, works with a single Content and based on the ReactControlMapper
 * 
 * Usage:
 * ```html
 *  <NewView content={content} history={history} onSubmit={createSubmitClick} />
 * ```
 */
export class NewView extends React.Component<INewViewProps, { content, schema, type }> {
    /**
     * constructor
     * @param {object} props
     */
    constructor(props: any) {
        super(props);
        /**
         * @type {object}
         * @property {any} content empty base Content
         */
        this.state = {
            content: this.props.content,
            schema: ReactControlMapper.GetFullSchemaForContent(this.props.content as any, 'new'),
            type: this.props.content.constructor
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }
    /**
     * handle cancle button click
     */
    handleCancel() {
        if (this.props.history) {
            this.props.history.goBack()
        }
        else {
            window.history.back();
        }
    }
    /**
     * handle change event on an input
     * @param {SytheticEvent} event
     */
    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.props.content[name] = value;

        this.setState({
            content: this.props.content
        });
    }
    /**
     * render
     * @return {ReactElement} markup
     */
    render() {
        const fieldSettings = this.state.schema.FieldMappings;
        const that = this;
        const onChangeEvent = this.handleInputChange;
        return (
            <Row>
                <form style={styles.container} onSubmit={(e) => {
                    e.preventDefault();
                    if (this.props.onSubmit) {
                        this.props.onSubmit(this.props.content.Path, this.state.type, this.state.content.GetFields())
                    }
                    if (this.props.history) {
                        this.props.history.goBack()
                    }
                    else {
                        window.history.back();
                    }
                }
                }>
                    <h4>Create new {this.state.schema.Schema.DisplayName}</h4>
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
                                            'onChange': onChangeEvent,
                                            'data-actionName': 'new'
                                        })
                                }
                            </Col>)

                        })
                    }
                    <Col s={12} m={12} l={12} style={styles.buttonContainer}>
                        <Button waves='light' type='submit'>Submit</Button>
                        <Button waves='light' onClick={this.handleCancel}>Cancel</Button>
                    </Col >
                </form>
            </Row>
        )
    }
}