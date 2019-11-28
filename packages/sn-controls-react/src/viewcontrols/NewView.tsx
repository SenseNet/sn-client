/**
 * @module ViewControls
 */
import React, { createElement, ReactElement, useState } from 'react'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { Repository } from '@sensenet/client-core'
import { ContentType } from '@sensenet/default-content-types'
import MediaQuery from 'react-responsive'
import { reactControlMapper } from '../ReactControlMapper'

/**
 * Interface for NewView properties
 */
export interface NewViewProps {
  onSubmit?: (path: string, content: ContentType, contentTypeName: string, contentTemplateName?: string) => void
  repository: Repository
  renderIcon?: (name: string) => ReactElement
  path: string
  contentTypeName: string
  handleCancel?: () => void
  submitCallback?: () => void
  showTitle?: boolean
  extension?: string
  uploadFolderpath?: string
}

/**
 * View Control for adding a Content, works with a single Content and based on the ReactControlMapper
 *
 * Usage:
 * ```html
 *  <NewView content={content} onSubmit={createSubmitClick} />
 * ```
 */
export const NewView: React.FC<NewViewProps> = props => {
  const controlMapper = reactControlMapper(props.repository)
  const schema = controlMapper.getFullSchemaForContentType(props.contentTypeName, 'new')
  const [content, setContent] = useState({})

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    props.onSubmit &&
      props.onSubmit(props.path, content as any, schema.schema.ContentTypeName, schema.schema.ContentTypeName)
    props.submitCallback && props.submitCallback()
  }

  const handleInputChange = (field: string, value: unknown) => {
    setContent({ ...content, [field]: value })
  }

  return (
    <form style={{ margin: '0 auto' }} onSubmit={handleSubmit}>
      {props.showTitle && (
        <Typography variant="h5" gutterBottom={true}>
          {`New ${schema.schema.DisplayName}`}
        </Typography>
      )}
      <Grid container={true} spacing={2}>
        {schema.fieldMappings.map(field => {
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
                controlMapper.getControlForContentField(props.contentTypeName, field.fieldSettings.Name, 'new'),
                {
                  actionName: 'new',
                  settings: field.fieldSettings,
                  repository: props.repository,
                  renderIcon: props.renderIcon,
                  fieldOnChange: handleInputChange,
                  extension: props.extension,
                  uploadFolderPath: props.uploadFolderpath,
                },
              )}
            </Grid>
          )
        })}
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12} style={{ textAlign: 'right' }}>
          <MediaQuery minDeviceWidth={700}>
            <Button
              color="default"
              style={{ marginRight: 20 }}
              onClick={() => props.handleCancel && props.handleCancel()}>
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
