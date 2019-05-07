/**
 * @module ViewControls
 *
 */
import React, { Component, createElement } from 'react'

import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { Repository } from '@sensenet/client-core'
import { ControlSchema } from '@sensenet/control-mapper'
import { GenericContent, Schema } from '@sensenet/default-content-types'
import MediaQuery from 'react-responsive'
import { ReactClientFieldSettingProps } from '../fieldcontrols/ClientFieldSetting'
import { reactControlMapper } from '../ReactControlMapper'
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
  schema: ControlSchema<React.Component, ReactClientFieldSettingProps>
  dataSource: GenericContent[]
  content: T
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
      content: {} as T,
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
  public handleInputChange(field: keyof T, value: T[K]) {
    ;(this.state.content as T)[field] = value
  }
  /**
   * render
   * @return {ReactElement} markup
   */
  public render() {
    const fieldSettings = this.state.schema.fieldMappings
    const { onSubmit, repository, path, columns, contentTypeName, extension, title, submitCallback } = this.props
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
        <Grid container={true} spacing={24}>
          {fieldSettings.map(fieldSetting => {
            if (fieldSetting.clientSettings['data-typeName'] === 'ReferenceFieldSetting') {
              fieldSetting.clientSettings['data-repository'] = repository
            }
            if (
              contentTypeName.indexOf('File') > -1 &&
              extension &&
              fieldSetting.fieldSettings.ControlHint === 'sn:FileName'
            ) {
              fieldSetting.clientSettings['data-extension'] = extension
            }
            fieldSetting.clientSettings.onChange = this.handleInputChange as any
            fieldSetting.clientSettings['data-actionName'] = 'new'
            fieldSetting.clientSettings['data-uploadFolderPath'] = this.props.uploadFolderPath || ''
            fieldSetting.clientSettings['data-repository'] = this.props.repository
            fieldSetting.clientSettings['data-repositoryUrl'] = repository.configuration.repositoryUrl
            if (fieldSetting.fieldSettings.Type === 'CurrencyFieldSetting') {
              fieldSetting.fieldSettings.Type = 'NumberFieldSetting'
            }
            if (
              fieldSetting.clientSettings['data-typeName'] === 'NullFieldSetting' &&
              fieldSetting.fieldSettings.Name === 'AllowedChildTypes'
            ) {
              // tslint:disable-next-line: no-string-literal
              fieldSetting.clientSettings['renderIconsDefault'] = this.props.renderIcon || undefined
            }
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
            <Button type="submit" variant="contained" color="secondary">
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    )
  }
}
