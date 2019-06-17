/**
 * @module ViewControls
 *
 */ /** */
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import { Repository } from '@sensenet/client-core'
import { ControlSchema } from '@sensenet/control-mapper'
import { GenericContent, Schema } from '@sensenet/default-content-types'
import React, { Component, createElement } from 'react'
import MediaQuery from 'react-responsive'
import { ReactClientFieldSetting } from '../fieldcontrols/ClientFieldSetting'
import { reactControlMapper } from '../ReactControlMapper'
import { styles } from './EditViewStyles'

/**
 * Interface for EditView properties
 */
export interface EditViewProps<T extends GenericContent = GenericContent> {
  content: T
  onSubmit?: (id: number, content: GenericContent) => void
  repository: Repository
  renderIcon?: (name: string) => JSX.Element
  schema?: Schema
  contentTypeName: string
  columns?: boolean
  handleCancel?: () => void
  submitCallback?: () => void
  repositoryUrl?: string
  uploadFolderPath?: string
}
/**
 * Interface for EditView state
 */
export interface EditViewState<T extends GenericContent = GenericContent> {
  content: T
  schema: ControlSchema<React.Component<any, any, any>, ReactClientFieldSetting>
  saveableContent: T
}

/**
 * View Control for editing a Content, works with a single Content and based on the ReactControlMapper
 *
 * Usage:
 * ```html
 *  <EditView content={selectedContent} onSubmit={editSubmitClick} />
 * ```
 */
export class EditView<T extends GenericContent, K extends keyof T> extends Component<
  EditViewProps<T>,
  EditViewState<T>
> {
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
      // eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
      saveableContent: {} as T,
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleCancel = this.handleCancel.bind(this)

    this.displayName = this.props.content.DisplayName || ''
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
    this.setState({
      content: { ...this.state.content, [field]: value },
      saveableContent: { ...this.state.saveableContent, [field]: value },
    })
  }
  /**
   * eturns a value of an input
   * @param {string} name name of the input
   * @return {any} value of the input or null
   */
  public getFieldValue(name: string | undefined) {
    if (name && this.state.content[name]) {
      return this.state.content[name]
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
      <form
        style={styles.container}
        onSubmit={e => {
          e.preventDefault()
          if (this.props.onSubmit) {
            this.props.onSubmit(this.state.content.Id, this.state.saveableContent)
          }
          return this.props.submitCallback ? this.props.submitCallback() : null
        }}>
        <Grid container={true} spacing={2}>
          {fieldSettings.map(fieldSetting => {
            fieldSetting.clientSettings.actionName = 'edit'
            fieldSetting.clientSettings['data-fieldValue'] = that.getFieldValue(fieldSetting.clientSettings.name)
            // eslint-disable-next-line dot-notation
            fieldSetting.clientSettings['content'] = this.state.content
            fieldSetting.clientSettings.value = that.getFieldValue(fieldSetting.clientSettings.name)
            fieldSetting.clientSettings.onChange = that.handleInputChange as any
            fieldSetting.clientSettings.renderIcon = this.props.renderIcon || undefined
            if (
              fieldSetting.clientSettings.typeName === 'NullFieldSetting' &&
              fieldSetting.fieldSettings.Name === 'Avatar'
            ) {
              //TODO: review this upload folder path
              fieldSetting.clientSettings['data-uploadFolderPath'] = this.props.uploadFolderPath || ''
            }
            if (fieldSetting.fieldSettings.Type === 'CurrencyFieldSetting') {
              fieldSetting.fieldSettings.Type = 'NumberFieldSetting'
            }
            return (
              <Grid
                item={true}
                xs={12}
                sm={12}
                md={fieldSetting.clientSettings.typeName === 'LongTextFieldSetting' || !columns ? 12 : 6}
                lg={fieldSetting.clientSettings.typeName === 'LongTextFieldSetting' || !columns ? 12 : 6}
                xl={fieldSetting.clientSettings.typeName === 'LongTextFieldSetting' || !columns ? 12 : 6}
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
