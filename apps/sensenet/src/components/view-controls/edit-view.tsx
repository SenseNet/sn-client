/**
 * @module ViewControls
 */
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import { Repository } from '@sensenet/client-core'
import { ContentType, GenericContent } from '@sensenet/default-content-types'
import React, { createElement, ReactElement, useState } from 'react'
import MediaQuery from 'react-responsive'
import { createStyles, makeStyles, Theme } from '@material-ui/core'
import { reactControlMapper } from '../react-control-mapper'

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    form: {
      margin: '0 auto',
      padding: '0 22px 39px 22px',
    },
    cancel: {
      marginRight: 38,
      border: theme.palette.type === 'light' ? '2px solid #212121DE' : '2px solid #505050',
    },
    grid: {
      display: 'grid',
      justifyContent: 'center',
      padding: '6px !important',
      height: 'fit-content',
    },
  })
})

/**
 * Interface for EditView properties
 */
export interface EditViewProps {
  content: ContentType
  onSubmit?: (content: GenericContent, saveableFields: Partial<GenericContent>) => void
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
  const classes = useStyles()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    props.onSubmit?.(props.content, saveableFields as any)
    props.submitCallback?.()
  }

  const handleInputChange = (field: string, value: unknown) => {
    setSaveableFields({ ...saveableFields, [field]: value })
  }

  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <Grid container={true} spacing={2}>
        {schema.fieldMappings
          .sort((item1, item2) => item2.fieldSettings.DefaultOrder! - item1.fieldSettings.DefaultOrder!)
          .map(field => {
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
                md={field.fieldSettings.Name === 'Avatar' || field.fieldSettings.Name === 'Enabled' ? 12 : 6}
                lg={field.fieldSettings.Name === 'Avatar' || field.fieldSettings.Name === 'Enabled' ? 12 : 6}
                xl={field.fieldSettings.Name === 'Avatar' || field.fieldSettings.Name === 'Enabled' ? 12 : 6}
                key={field.fieldSettings.Name}
                className={classes.grid}>
                {fieldControl}
              </Grid>
            )
          })}
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12} style={{ textAlign: 'right' }}>
          <MediaQuery minDeviceWidth={700}>
            <Button
              color="default"
              className={classes.cancel}
              onClick={() => props.handleCancel && props.handleCancel()}>
              Cancel
            </Button>
          </MediaQuery>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}
