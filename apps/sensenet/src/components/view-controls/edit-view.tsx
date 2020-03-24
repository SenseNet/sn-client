/**
 * @module ViewControls
 */
import { createStyles, makeStyles, Theme } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import { isExtendedError } from '@sensenet/client-core'
import { FieldSetting } from '@sensenet/default-content-types/src'
import { CurrentContentContext, useLogger, useRepository } from '@sensenet/hooks-react'
import React, { createElement, ReactElement, useContext, useState } from 'react'
import MediaQuery from 'react-responsive'
import clsx from 'clsx'
import { useLocalization } from '../../hooks'
import { reactControlMapper } from '../react-control-mapper'

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    form: {
      margin: '0 auto',
      padding: '22px 22px 39px 22px',
      overflowY: 'auto',
    },
    cancel: {
      marginRight: 38,
      border: theme.palette.type === 'light' ? '2px solid #212121DE' : '2px solid #505050',
    },
    grid: {
      display: 'flex',
      alignItems: 'center',
      flexFlow: 'column',
      padding: '6px !important',
      height: 'fit-content',
      position: 'relative',
    },
    wrapper: {
      width: '75%',
      position: 'relative',
    },
    wrapperFullWidth: {
      width: '88%',
    },
  })
})

/**
 * Interface for EditView properties
 */
export interface EditViewProps {
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
  const repo = useRepository()
  const content = useContext(CurrentContentContext)
  const controlMapper = reactControlMapper(repo)
  const schema = controlMapper.getFullSchemaForContentType(content.Type, 'edit')
  const [saveableFields, setSaveableFields] = useState({})
  const classes = useStyles()
  const localization = useLocalization()
  const logger = useLogger('EditView')

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    repo
      .patch({
        idOrPath: content.Id,
        content: saveableFields,
      })
      .then(response => {
        logger.information({
          message: localization.editPropertiesDialog.saveSuccessNotification.replace(
            '{0}',
            content.DisplayName || content.Name || content.DisplayName || content.Name,
          ),
          data: {
            relatedContent: content,
            content: response,
            relatedRepository: repo.configuration.repositoryUrl,
          },
        })
      })
      .catch(error => {
        logger.error({
          message: localization.editPropertiesDialog.saveFailedNotification.replace(
            '{0}',
            content.DisplayName || content.Name || content.DisplayName || content.Name,
          ),
          data: {
            relatedContent: content,
            content,
            relatedRepository: repo.configuration.repositoryUrl,
            error: isExtendedError(error) ? repo.getErrorFromResponse(error.response) : error,
          },
        })
      })
  }

  const handleInputChange = (field: string, value: unknown) => {
    setSaveableFields({ ...saveableFields, [field]: value })
  }

  const isFullWidthField = (field: { fieldSettings: FieldSetting }) => {
    return (
      field.fieldSettings.Name === 'Avatar' ||
      field.fieldSettings.Name === 'Enabled' ||
      field.fieldSettings.Name === 'Description'
    )
  }

  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <Grid container={true} spacing={2}>
        {schema.fieldMappings
          .sort((item1, item2) => item2.fieldSettings.DefaultOrder! - item1.fieldSettings.DefaultOrder!)
          .map(field => {
            const fieldControl = createElement(
              controlMapper.getControlForContentField(content.Type, field.fieldSettings.Name, 'edit'),
              {
                repository: repo,
                settings: field.fieldSettings,
                content,
                fieldValue: (content as any)[field.fieldSettings.Name],
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
                md={isFullWidthField(field) ? 12 : 6}
                lg={isFullWidthField(field) ? 12 : 6}
                xl={isFullWidthField(field) ? 12 : 6}
                key={field.fieldSettings.Name}
                className={classes.grid}>
                <div
                  className={clsx(classes.wrapper, {
                    [classes.wrapperFullWidth]: isFullWidthField(field),
                  })}>
                  {fieldControl}
                </div>
              </Grid>
            )
          })}
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12} style={{ textAlign: 'right' }}>
          <MediaQuery minDeviceWidth={700}>
            <Button
              color="default"
              className={classes.cancel}
              onClick={() => props.handleCancel && props.handleCancel()}>
              {localization.forms.cancel}
            </Button>
          </MediaQuery>
          <Button type="submit" variant="contained" color="primary">
            {localization.forms.submit}
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}
