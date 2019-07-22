/**
 * @module ViewControls
 */
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import { Repository } from '@sensenet/client-core'
import { ControlSchema } from '@sensenet/control-mapper'
import { ContentType, GenericContent } from '@sensenet/default-content-types'
import React, { Component, ComponentType, createElement, ReactElement } from 'react'
import MediaQuery from 'react-responsive'
import { reactControlMapper } from '../ReactControlMapper'
import { ReactClientFieldSetting } from '../fieldcontrols/ClientFieldSetting'

/**
 * Interface for EditView properties
 */
export interface EditViewProps {
  content: ContentType
  onSubmit?: (id: number, content: GenericContent) => void
  repository: Repository
  renderIcon?: (name: string) => ReactElement
  handleCancel?: () => void
  submitCallback?: () => void
  uploadFolderpath?: string
}
/**
 * Interface for EditView state
 */
export interface EditViewState {
  content: ContentType
  schema: ControlSchema<ComponentType, ComponentType<ReactClientFieldSetting>>
  saveableContent: ContentType
  controlMapper: ReturnType<typeof reactControlMapper>
}

/**
 * View Control for editing a Content, works with a single Content and based on the ReactControlMapper
 *
 * Usage:
 * ```html
 *  <EditView content={selectedContent} onSubmit={editSubmitClick} />
 * ```
 */
export class EditView extends Component<EditViewProps, EditViewState> {
  constructor(props: any) {
    super(props)
    const controlMapper = reactControlMapper(this.props.repository)
    this.state = {
      content: this.props.content,
      schema: controlMapper.getFullSchemaForContentType(this.props.content.Type, 'edit'),
      // eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
      saveableContent: {} as ContentType,
      controlMapper,
    }

    this.handleInputChange = this.handleInputChange.bind(this)
  }

  /**
   * handle change event on an input
   */
  public handleInputChange(field: string, value: any) {
    this.setState({
      content: { ...this.state.content, [field]: value },
      saveableContent: { ...this.state.saveableContent, [field]: value },
    })
  }

  public render() {
    return (
      <form
        style={{ margin: '0 auto' }}
        onSubmit={e => {
          e.preventDefault()
          if (this.props.onSubmit) {
            this.props.onSubmit(this.state.content.Id, this.state.saveableContent)
          }
          return this.props.submitCallback ? this.props.submitCallback() : null
        }}>
        <Grid container={true} spacing={2}>
          {this.state.schema.fieldMappings.map(field => {
            const fieldControl = createElement(
              this.state.controlMapper.getControlForContentField(
                this.props.content.Type,
                field.fieldSettings.Name,
                'edit',
              ),
              {
                repository: this.props.repository,
                settings: field.fieldSettings,
                content: this.state.content,
                fieldValue: (this.state.content as any)[field.fieldSettings.Name],
                actionName: 'edit',
                renderIcon: this.props.renderIcon,
                fieldOnChange: this.handleInputChange,
                uploadFolderPath: this.props.uploadFolderpath,
              },
            )

            return (
              <Grid
                item={true}
                xs={12}
                sm={12}
                md={field.fieldSettings.Name === 'LongTextFieldSetting' ? 12 : 6}
                lg={field.fieldSettings.Name === 'LongTextFieldSetting' ? 12 : 6}
                xl={field.fieldSettings.Name === 'LongTextFieldSetting' ? 12 : 6}
                key={field.fieldSettings.Name}>
                {fieldControl}
              </Grid>
            )
          })}
          <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12} style={{ textAlign: 'right' }}>
            <MediaQuery minDeviceWidth={700}>
              <Button
                color="default"
                style={{ marginRight: 20 }}
                onClick={() => this.props.handleCancel && this.props.handleCancel()}>
                Cancel
              </Button>
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
