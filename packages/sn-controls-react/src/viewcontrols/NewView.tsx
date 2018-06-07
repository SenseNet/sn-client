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
    schema,
    path
}

/**
 * View Control for adding a Content, works with a single Content and based on the ReactControlMapper
 *
 * Usage:
 * ```html
 *  <NewView content={content} history={history} onSubmit={createSubmitClick} />
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
        this.state = {
            schema: reactControlMapper.getFullSchemaForContentType(this.props.schema.ContentTypeName as any, 'new'),
            dataSource: [],
        }
        this.handleCancel = this.handleCancel.bind(this)
        this.formIsValid()
    }
    /**
     * handle cancle button click
     */
    public handleCancel() {
        if (this.props.history) {
            this.props.history.goBack()
        } else {
            window.history.back()
        }
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
        const { fields, onSubmit, history, repository, changeAction, path } = this.props
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
                if (history) {
                    history.goBack()
                } else {
                    window.history.back()
                }
            }
            }>
                <Typography variant="headline" gutterBottom>
                    Create new {schema.schema.DisplayName}
                </Typography>
                <Grid container spacing={24}>
                    {
                        fieldSettings.map((e, i) => {
                            if (fieldSettings[i].clientSettings['data-typeName'] === 'ReferenceFieldSetting') {
                                fieldSettings[i].clientSettings['data-repository'] = repository
                            }
                            return (<Grid item xs={12} style={{ marginBottom: 16 }}
                                sm={12}
                                md={fieldSettings[i].clientSettings['data-typeName'] === 'LongTextFieldSetting' ? 12 : 6}
                                lg={fieldSettings[i].clientSettings['data-typeName'] === 'LongTextFieldSetting' ? 12 : 6}
                                xl={fieldSettings[i].clientSettings['data-typeName'] === 'LongTextFieldSetting' ? 12 : 6}
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
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ textAlign: 'right', marginTop: 20 }}>
                        <Button type="submit" variant="raised" color="primary" style={{ color: '#fff', marginRight: 20 }}>Submit</Button>
                        <Button variant="raised" color="secondary">Cancel</Button>
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
