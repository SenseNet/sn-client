/**
 * @module ViewControls
 */
import React, { Component, ComponentType, createElement, ReactElement } from 'react'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { Repository } from '@sensenet/client-core'
import { ControlSchema } from '@sensenet/control-mapper'
import { ContentType } from '@sensenet/default-content-types'
import MediaQuery from 'react-responsive'
import { reactControlMapper } from '../ReactControlMapper'
import { ReactClientFieldSetting } from '../fieldcontrols/ClientFieldSetting'

/**
 * Interface for NewView properties
 */
export interface NewViewProps {
  onSubmit?: (path: string, content: ContentType, contentTypeName: string) => void
  repository: Repository
  renderIcon?: (name: string) => ReactElement
  path: string
  contentTypeName: string
  handleCancel?: () => void
  submitCallback?: () => void
  title?: string
  extension?: string
}
/**
 * Interface for NewView state
 */
export interface NewViewState {
  schema: ControlSchema<ComponentType, ComponentType<ReactClientFieldSetting>>
  content: ContentType
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
export class NewView extends Component<NewViewProps, NewViewState> {
  constructor(props: any) {
    super(props)
    const controlMapper = reactControlMapper(this.props.repository)
    this.state = {
      schema: controlMapper.getFullSchemaForContentType(this.props.contentTypeName, 'new'),
      // eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
      content: {} as ContentType,
      controlMapper,
    }

    this.handleInputChange = this.handleInputChange.bind(this)
  }

  public handleInputChange(field: string, value: unknown) {
    this.setState({
      content: { ...this.state.content, [field]: value },
    })
  }

  public render() {
    const { onSubmit, path, title, submitCallback } = this.props
    const { schema } = this.state
    return (
      <form
        style={{ margin: '0 auto' }}
        onSubmit={e => {
          e.preventDefault()
          if (onSubmit) {
            onSubmit(path, this.state.content, schema.schema.ContentTypeName)
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
          {this.state.schema.fieldMappings.map(field => {
            return (
              <Grid
                item={true}
                xs={12}
                sm={12}
                md={field.fieldSettings.Name === 'LongTextFieldSetting' ? 12 : 6}
                lg={field.fieldSettings.Name === 'LongTextFieldSetting' ? 12 : 6}
                xl={field.fieldSettings.Name === 'LongTextFieldSetting' ? 12 : 6}
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
                    repository: this.props.repository,
                    renderIcon: this.props.renderIcon,
                    fieldOnChange: this.handleInputChange,
                    extension: this.props.extension,
                  },
                )}
              </Grid>
            )
          })}
          <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12} style={{ textAlign: 'right' }}>
            <MediaQuery minDeviceWidth={700}>
              {matches =>
                matches ? (
                  <Button
                    color="default"
                    style={{ marginRight: 20 }}
                    onClick={() => this.props.handleCancel && this.props.handleCancel()}>
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
