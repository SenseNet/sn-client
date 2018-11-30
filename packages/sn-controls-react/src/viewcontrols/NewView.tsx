/**
 * @module ViewControls
 *
 */
import React, { Component, createElement } from 'react'
import { connect } from 'react-redux'

import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { Repository } from '@sensenet/client-core'
import { ControlSchema } from '@sensenet/control-mapper'
import { GenericContent, Schema } from '@sensenet/default-content-types'
import { Actions, Reducers } from '@sensenet/redux'
import MediaQuery from 'react-responsive'
import { ReactClientFieldSettingProps } from '../fieldcontrols/ClientFieldSetting'
import { reactControlMapper } from '../ReactControlMapper'
import { RootStateType } from './index'
import { styles } from './NewViewStyles'

/**
 * Interface for NewView properties
 */
export interface NewViewProps<T extends GenericContent> {
  onSubmit?: (path: string, content: T, contentTypeName: string) => void
  repository: Repository
  changeAction: (e: React.MouseEvent, content: T) => void
  schema?: Schema
  path: string
  contentTypeName: string
  extension?: string
  columns?: string[]
  handleCancel?: () => void
  submitCallback?: () => void
  title?: string
}
/**
 * Interface for NewView state
 */
export interface NewViewState {
  schema: ControlSchema<React.Component, ReactClientFieldSettingProps>
  dataSource: GenericContent[]
}

const mapStateToProps = (state: RootStateType) => {
  return {
    fields: Reducers.getFields(state.sensenet),
  }
}

const mapDispatchToProps = {
  changeAction: Actions.changeFieldValue,
}

/**
 * View Control for adding a Content, works with a single Content and based on the ReactControlMapper
 *
 * Usage:
 * ```html
 *  <NewView content={content} onSubmit={createSubmitClick} />
 * ```
 */
class NewView<T extends GenericContent> extends Component<
  NewViewProps<T> & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps,
  NewViewState
> {
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
      schema: controlMapper.getFullSchemaForContentType(this.props.contentTypeName, 'new'),
      dataSource: [],
    }
    this.handleCancel = this.handleCancel.bind(this)
  }
  /**
   * handle cancle button click
   */
  public handleCancel() {
    return this.props.handleCancel ? this.props.handleCancel() : null
  }
  /**
   * render
   * @return {ReactElement} markup
   */
  public render() {
    const fieldSettings = this.state.schema.fieldMappings
    const {
      fields,
      onSubmit,
      repository,
      changeAction,
      path,
      columns,
      contentTypeName,
      extension,
      title,
      submitCallback,
    } = this.props
    const { schema } = this.state
    return (
      <form
        style={styles.container}
        onSubmit={e => {
          e.preventDefault()
          if (onSubmit) {
            const c = fields as T
            onSubmit(path, c, schema.schema.ContentTypeName)
          }
          if (submitCallback) {
            submitCallback()
          }
        }}>
        <Typography variant="headline" gutterBottom={true}>
          {title && title.length > 0 ? `New ${this.props.title}` : `New {schema.schema.DisplayName}`}
        </Typography>
        <Grid container={true} spacing={24}>
          {fieldSettings.map(fieldSetting => {
            if (fieldSetting.clientSettings['data-typeName'] === 'ReferenceFieldSetting') {
              fieldSetting.clientSettings['data-repository'] = repository
            }
            if (contentTypeName === 'File' && extension && fieldSetting.fieldSettings.ControlHint === 'sn:FileName') {
              fieldSetting.clientSettings['data-extension'] = extension
            }
            fieldSetting.clientSettings.onChange = changeAction
            fieldSetting.clientSettings['data-actionName'] = 'new'
            return (
              <Grid
                item={true}
                xs={12}
                sm={12}
                md={fieldSetting.clientSettings['data-typeName'] === 'LongTextFieldSetting' || !columns ? 12 : 6}
                lg={fieldSetting.clientSettings['data-typeName'] === 'LongTextFieldSetting' || !columns ? 12 : 6}
                xl={fieldSetting.clientSettings['data-typeName'] === 'LongTextFieldSetting' || !columns ? 12 : 6}
                key={fieldSetting.clientSettings.name}>
                {createElement(fieldSetting.controlType, {
                  ...fieldSetting.clientSettings,
                })}
              </Grid>
            )
          })}
          <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12} style={{ textAlign: 'right' }}>
            <MediaQuery minDeviceWidth={700}>
              {matches =>
                matches ? (
                  <Button color="default" style={{ marginRight: 20 }} onClick={() => this.handleCancel()}>
                    Cancel
                  </Button>
                ) : null
              }
            </MediaQuery>
            <Button type="submit" variant="raised" color="secondary">
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    )
  }
}

const newView = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewView)
export { newView as NewView }
