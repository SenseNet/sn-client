/**
 * @module ViewControls
 */
import { Repository } from '@sensenet/client-core'
import { ControlMapper } from '@sensenet/control-mapper'
import { FieldSetting, GenericContent } from '@sensenet/default-content-types'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import React, { createElement, ReactElement } from 'react'
import { reactControlMapper } from '../ReactControlMapper'

/**
 * Interface for BrowseView properties
 */
export interface BrowseViewProps {
  content: GenericContent
  repository: Repository
  renderIcon?: (name: string) => ReactElement
  renderTitle?: () => ReactElement
  controlMapper?: ControlMapper<any, any>
  handleCancel?: () => void
  localization?: {
    cancel?: string
  }
  classes?: {
    grid?: string
    fieldWrapper?: string
    field?: string
    fieldFullWidth?: string
    actionButtonWrapper?: string
    cancel?: string
  }
}

const useStyles = makeStyles(() => {
  return createStyles({
    actionButtonWrapper: {
      textAlign: 'right',
    },
  })
})

/**
 * View Control for browsing a Content, works with a single Content and based on the ReactControlMapper
 */
export const BrowseView: React.FC<BrowseViewProps> = (props) => {
  const controlMapper = props.controlMapper || reactControlMapper(props.repository)
  const schema = controlMapper.getFullSchemaForContentType(props.content.Type, 'browse')
  const defaultClasses = useStyles()

  const isFullWidthField = (field: { fieldSettings: FieldSetting }) => {
    return (
      (field.fieldSettings.Name === 'Avatar' && props.content.Type.includes('User')) ||
      (field.fieldSettings.Name === 'Enabled' && props.content.Type.includes('User')) ||
      field.fieldSettings.Type === 'LongTextFieldSetting'
    )
  }

  return (
    <>
      {props.renderTitle ? (
        props.renderTitle()
      ) : (
        <Typography variant="h5" gutterBottom={true}>
          {schema.schema.DisplayName}
        </Typography>
      )}
      <Grid container={true} spacing={2} className={props.classes?.grid}>
        {schema.fieldMappings
          .sort((item1, item2) => (item2.fieldSettings.FieldIndex || 0) - (item1.fieldSettings.FieldIndex || 0))
          .map((field) => {
            const isFullWidth = isFullWidthField(field)

            return (
              <Grid
                item={true}
                xs={12}
                sm={12}
                md={isFullWidth ? 12 : 6}
                lg={isFullWidth ? 12 : 6}
                xl={isFullWidth ? 12 : 6}
                key={field.fieldSettings.Name}
                className={props.classes?.fieldWrapper}>
                <div className={isFullWidth ? props.classes?.fieldFullWidth : props.classes?.field}>
                  {createElement(
                    controlMapper.getControlForContentField(props.content.Type, field.fieldSettings.Name, 'browse'),
                    {
                      actionName: 'browse',
                      settings: field.fieldSettings,
                      content: props.content,
                      fieldValue: (props.content as any)[field.fieldSettings.Name],
                      renderIcon: props.renderIcon,
                      repository: props.repository,
                    },
                  )}
                </div>
              </Grid>
            )
          })}
      </Grid>
      <div className={props.classes?.actionButtonWrapper || defaultClasses.actionButtonWrapper}>
        <Button
          aria-label={props.localization?.cancel || 'Cancel'}
          color="default"
          className={props.classes?.cancel}
          onClick={() => props.handleCancel?.()}>
          {props.localization?.cancel || 'Cancel'}
        </Button>
      </div>
    </>
  )
}
