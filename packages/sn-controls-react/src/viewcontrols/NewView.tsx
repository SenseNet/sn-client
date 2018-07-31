/**
 * @module ViewControls
 *
 */ /** */
import * as React from 'react'
import { connect } from 'react-redux'

import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { Actions, Reducers } from '@sensenet/redux'
import { reactControlMapper } from '../ReactControlMapper'
import { styles } from './NewViewStyles'

/**
 * Interface for NewView properties
 */
export interface NewViewProps {
    history?,
    onSubmit?,
    repository,
    fields,
    changeAction,
    schema?,
    path,
    contentTypeName,
    columns?,
    handleCancel?,
    submitCallback?,
}

/**
 * View Control for adding a Content, works with a single Content and based on the ReactControlMapper
 *
 * Usage:
 * ```html
 *  <NewView content={content} onSubmit={createSubmitClick} />
 * ```
 */
class NewView extends React.Component<NewViewProps, { schema, dataSource }> {
    /**
     * constructor
     * @param {object} props
     */
    constructor(props: any) {
        super(props)
        /**
         * @type {object}
         * @property {any} content empty base Content
         */
        const controlMapper = reactControlMapper(this.props.repository)
        this.state = {
            schema: controlMapper.getFullSchemaForContentType(this.props.contentTypeName as any, 'new'),
            dataSource: [],
        }
        this.handleCancel = this.handleCancel.bind(this)
        this.formIsValid()
    }
    /**
     * handle cancle button click
     */
    public handleCancel() {
        return this.props.handleCancel ? this.props.handleCancel() :  null
    }
    /**
     * check if all the required fields are set
     */
    public formIsValid() {
        let valid = true
        const { fields } = this.props
        this.state.schema.fieldMappings.map((setting) => {
            valid = fields[setting.clientSettings.name] === undefined ? false : true
        })
        return valid
    }
    /**
     * render
     * @return {ReactElement} markup
     */
    public render() {
        const fieldSettings = this.state.schema.fieldMappings
        const { fields, onSubmit, repository, changeAction, path, columns } = this.props
        const { schema } = this.state
        return (
            <form style={styles.container} onSubmit={(e) => {
                e.preventDefault()
                if (onSubmit) {
                    const c = fields
                    if (this.formIsValid()) {
                        onSubmit(path, c, schema.schema.ContentTypeName)
                    }
                }
                return this.props.submitCallback ? this.props.submitCallback() :  null
            }
            }>
                <Typography variant="headline" gutterBottom>
                    New {schema.schema.DisplayName}
                </Typography>
                <Grid container spacing={24}>
                    {
                        fieldSettings.map((e, i) => {
                            if (fieldSettings[i].clientSettings['data-typeName'] === 'ReferenceFieldSetting') {
                                fieldSettings[i].clientSettings['data-repository'] = repository
                            }
                            return (<Grid item xs={12} style={{ marginBottom: 16 }}
                                sm={12}
                                md={fieldSettings[i].clientSettings['data-typeName'] === 'LongTextFieldSetting' || !columns ? 12 : 6}
                                lg={fieldSettings[i].clientSettings['data-typeName'] === 'LongTextFieldSetting' || !columns ? 12 : 6}
                                xl={fieldSettings[i].clientSettings['data-typeName'] === 'LongTextFieldSetting' || !columns ? 12 : 6}
                                key={fieldSettings[i].clientSettings.name}>
                                {
                                    React.createElement(
                                        fieldSettings[i].controlType,
                                        {
                                            ...fieldSettings[i].clientSettings,
                                            'data-actionName': 'new',
                                            'onChange': changeAction,
                                        })
                                }
                            </Grid>)

                        })
                    }
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ textAlign: 'right' }}>
                        <Button color="default" style={{ marginRight: 20 }} onClick={() => this.handleCancel()}>Cancel</Button>
                        <Button type="submit" variant="raised" color="secondary">Submit</Button>
                    </Grid>

                </Grid>
            </form>
        )
    }
}

const mapStateToProps = (state, match) => {
    return {
        fields: Reducers.getFields(state.sensenet),
    }
}

const newView = connect(mapStateToProps, {
    changeAction: Actions.changeFieldValue,
})(NewView)
export { newView as NewView }
