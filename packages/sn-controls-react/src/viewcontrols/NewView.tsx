/**
 * @module ViewControls
 */
import React, { Component, createElement, ComponentType } from 'react'

import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { Repository } from '@sensenet/client-core'
import { ControlSchema } from '@sensenet/control-mapper'
import { GenericContent, Schema } from '@sensenet/default-content-types'
import MediaQuery from 'react-responsive'
import { reactControlMapper } from '../ReactControlMapper'
import { ReactClientFieldSetting } from '../fieldcontrols/ClientFieldSetting'
import { styles } from './NewViewStyles'

/**
 * Interface for NewView properties
 */
export interface NewViewProps<T extends GenericContent = GenericContent> {
  onSubmit?: (path: string, content: T, contentTypeName: string) => void
  repository: Repository
  renderIcon?: (name: string) => JSX.Element
  schema?: Schema
  path: string
  contentTypeName: string
  extension?: string
  columns?: string[]
  handleCancel?: () => void
  submitCallback?: () => void
  title?: string
  uploadFolderPath?: string
}
/**
 * Interface for NewView state
 */
export interface NewViewState<T extends GenericContent = GenericContent> {
  schema: ControlSchema<ComponentType, ComponentType<ReactClientFieldSetting>>
  dataSource: GenericContent[]
  content: T
  controlMapper: ReturnType<typeof reactControlMapper>
}

/**
 * View Control for adding a Content, works with a single Content and based on the ReactControlMapper
 *
 * Usage:
 * ```html
 *  <NewView content={content} onSubmit={createSubmitClick} />
 * ```
 */
export class NewView<T extends GenericContent, K extends keyof T> extends Component<NewViewProps<T>, NewViewState> {
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
      // eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
      content: {} as T,
      controlMapper,
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
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
  public handleInputChange(field: string, value: T[K]) {
    ;(this.state.content as T)[field] = value
  }
  /**
   * render
   * @return {ReactElement} markup
   */
  public render() {
    const fieldSettings = this.state.schema.fieldMappings
    const { onSubmit, path, columns, title, submitCallback } = this.props
    const { schema } = this.state
    return (
      <form
        style={styles.container}
        onSubmit={e => {
          e.preventDefault()
          if (onSubmit) {
            onSubmit(path, this.state.content as T, schema.schema.ContentTypeName)
          }
          if (submitCallback) {
            submitCallback()
          }
        }}>
        {title !== undefined ? (
          <Typography variant="h5" gutterBottom={true}>
            {`New ${schema.schema.DisplayName}`}
          </Typography>
        ) : (
          title
        )}
        <Grid container={true} spacing={2}>
          {fieldSettings.map(field => {
            // if (
            //   contentTypeName.indexOf('File') > -1 &&
            //   extension &&
            //   fieldSetting.fieldSettings.ControlHint === 'sn:FileName'
            // ) {
            //   fieldSetting.clientSettings['extension'] = extension
            // }
            // fieldSetting.clientSettings.onChange = this.handleInputChange as any
            // fieldSetting.clientSettings.actionName = 'new'
            // // TODO: review this uploadFolderPath
            // fieldSetting.clientSettings['data-uploadFolderPath'] = this.props.uploadFolderPath || ''
            // fieldSetting.clientSettings.renderIcon = this.props.renderIcon || undefined
            // if (fieldSetting.fieldSettings.Type === 'CurrencyFieldSetting') {
            //   fieldSetting.fieldSettings.Type = 'NumberFieldSetting'
            // }
            return (
              <Grid
                item={true}
                xs={12}
                sm={12}
                md={field.fieldSettings.Name === 'LongTextFieldSetting' || !columns ? 12 : 6}
                lg={field.fieldSettings.Name === 'LongTextFieldSetting' || !columns ? 12 : 6}
                xl={field.fieldSettings.Name === 'LongTextFieldSetting' || !columns ? 12 : 6}
                key={field.fieldSettings.Name}>
                {createElement(
                  this.state.controlMapper.getControlForContentField(
                    this.props.contentTypeName,
                    field.fieldSettings.Name,
                    'new',
                  ),
                  {
                    actionName: 'new',
                    settings: field.fieldSettings,
                    content: this.state.content,
                    repository: this.props.repository,
                    renderIcon: this.props.renderIcon,
                    fieldOnChange: this.handleInputChange,
                  },
                )}
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
            <Button type="submit" variant="contained" color="secondary">
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    )
  }
}
