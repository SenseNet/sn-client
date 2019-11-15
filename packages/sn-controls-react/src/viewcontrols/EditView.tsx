/**
 * @module ViewControls
 */
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import { Repository } from '@sensenet/client-core'
import { ContentType, GenericContent } from '@sensenet/default-content-types'
import React, { createElement, ReactElement, useState } from 'react'
import MediaQuery from 'react-responsive'
import { reactControlMapper } from '../ReactControlMapper'

/**
 * Interface for EditView properties
 */
export interface EditViewProps {
  content: ContentType
  onSubmit?: (content: GenericContent, saveableFields: GenericContent) => void
  repository: Repository
  renderIcon?: (name: string) => ReactElement
  handleCancel?: () => void
  submitCallback?: () => void
  uploadFolderpath?: string
}

/**
 * View Control for editing a Content, works with a single Content and based on the ReactControlMapper
 *
 * Usage:
 * ```html
 *  <EditView content={selectedContent} onSubmit={editSubmitClick} />
 * ```
 */
export const EditView: React.FC<EditViewProps> = props => {
  const controlMapper = reactControlMapper(props.repository)
  const schema = controlMapper.getFullSchemaForContentType(props.content.Type, 'edit')
  const [saveableFields, setSaveableFields] = useState({})

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    props.onSubmit?.(props.content, saveableFields as any)
    props.submitCallback && props.submitCallback()
  }

  const handleInputChange = (field: string, value: unknown) => {
    setSaveableFields({ ...saveableFields, [field]: value })
  }

  return (
    <form style={{ margin: '0 auto' }} onSubmit={handleSubmit}>
      <Grid container={true} spacing={2}>
        {schema.fieldMappings.map(field => {
          const fieldControl = createElement(
            controlMapper.getControlForContentField(props.content.Type, field.fieldSettings.Name, 'edit'),
            {
              repository: props.repository,
              settings: field.fieldSettings,
              content: props.content,
              fieldValue: (props.content as any)[field.fieldSettings.Name],
              actionName: 'edit',
              renderIcon: props.renderIcon,
              fieldOnChange: handleInputChange,
              uploadFolderPath: props.uploadFolderpath,
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
