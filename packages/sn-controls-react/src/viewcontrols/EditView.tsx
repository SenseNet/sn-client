/**
 * @module ViewControls
 */
import { Repository } from '@sensenet/client-core'
import { ActionName, ControlMapper } from '@sensenet/control-mapper'
import { GenericContent } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import React, { createElement, ReactElement, useEffect, useRef, useState } from 'react'
import MediaQuery from 'react-responsive'
import { isFullWidthField } from '../helpers'
import { reactControlMapper } from '../ReactControlMapper'

/**
 * Interface for EditView properties
 */
export interface EditViewProps {
  repository: Repository
  actionName?: ActionName
  content?: GenericContent
  contentTypeName: string
  onSubmit?: (content: Partial<GenericContent>, contentTypeName?: string) => void
  renderIcon?: (name: string) => ReactElement
  renderTitle?: () => ReactElement
  handleCancel?: () => void
  showTitle?: boolean
  extension?: string
  uploadFolderpath?: string
  localization?: {
    cancel?: string
    submit?: string
  }
  classes?: {
    grid?: string
    fieldWrapper?: string
    field?: string
    fieldFullWidth?: string
    actionButtonWrapper?: string
    cancel?: string
  }
  controlMapper?: ControlMapper<any, any>
}

const useStyles = makeStyles(() => {
  return createStyles({
    grid: {
      margin: '0 auto',
    },
    actionButtonWrapper: {
      textAlign: 'right',
    },
    cancel: {
      marginRight: 20,
    },
  })
})

/**
 * View Control for editing a Content, works with a single Content and based on the ReactControlMapper
 *
 * Usage:
 * ```html
 *  <EditView content={selectedContent} contentTypeName={selectedContent.Type} onSubmit={editSubmitClick} />
 * ```
 */
export const EditView: React.FC<EditViewProps> = (props) => {
  const actionName = props.actionName || 'edit'
  const controlMapper = props.controlMapper || reactControlMapper(props.repository)
  const [schema, setSchema] = useState(controlMapper.getFullSchemaForContentType(props.contentTypeName, actionName))
  const [content, setContent] = useState({})
  const defaultClasses = useStyles()
  const repository = useRepository()
  const firstInputRef = useRef<HTMLDivElement>(null)

  const uniqueId = Date.now()

  const sortedFieldMappings = schema.fieldMappings.sort(
    (item1, item2) => (item2.fieldSettings.FieldIndex || 0) - (item1.fieldSettings.FieldIndex || 0),
  )

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    props.onSubmit?.(content, schema.schema.ContentTypeName)
  }

  const handleInputChange = (field: string, value: unknown) => {
    setContent({ ...content, [field]: value })
  }

  useEffect(() => {
    const firstInputField = firstInputRef.current?.querySelector('.MuiInputBase-input') as HTMLInputElement
    firstInputField?.focus()
  }, [firstInputRef])

  useEffect(() => {
    const schemaObservable = repository.schemas.subscribeToSchemas(() => {
      setSchema(() => controlMapper.getFullSchemaForContentType(props.contentTypeName, actionName))
    })
    return () => schemaObservable.dispose()
  }, [repository.schemas, actionName, controlMapper, props.contentTypeName])

  return (
    <>
      {props.showTitle &&
        (props.renderTitle ? (
          props.renderTitle()
        ) : (
          <Typography variant="h5" gutterBottom={true}>
            {`${actionName.charAt(0).toUpperCase()}${actionName.slice(1)} ${schema.schema.DisplayName}`}
          </Typography>
        ))}
      <Grid
        container={true}
        component={'form'}
        id={`edit-form-${uniqueId}`}
        onSubmit={handleSubmit}
        spacing={2}
        className={props.classes?.grid || defaultClasses.grid}>
        {sortedFieldMappings.map((field) => {
          const fieldControl = createElement(
            controlMapper.getControlForContentField(props.contentTypeName, field.fieldSettings.Name, actionName),
            {
              actionName,
              settings: field.fieldSettings,
              repository: props.repository,
              content: props.content,
              fieldValue: props.content ? (props.content as any)[field.fieldSettings.Name] : undefined,
              renderIcon: props.renderIcon,
              fieldOnChange: handleInputChange,
              extension: props.extension,
              uploadFolderPath: props.uploadFolderpath,
            },
          )

          const isFullWidth = isFullWidthField(field, props.contentTypeName)

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
              {sortedFieldMappings[0] === field ? (
                <div className={isFullWidth ? props.classes?.fieldFullWidth : props.classes?.field} ref={firstInputRef}>
                  {fieldControl}
                </div>
              ) : (
                <div className={isFullWidth ? props.classes?.fieldFullWidth : props.classes?.field}>{fieldControl}</div>
              )}
            </Grid>
          )
        })}
      </Grid>
      <div className={props.classes?.actionButtonWrapper || defaultClasses.actionButtonWrapper}>
        <MediaQuery minDeviceWidth={700}>
          <Button
            aria-label={props.localization?.cancel || 'Cancel'}
            color="default"
            className={props.classes?.cancel || defaultClasses.cancel}
            onClick={() => props.handleCancel?.()}>
            {props.localization?.cancel || 'Cancel'}
          </Button>
        </MediaQuery>
        <Button
          aria-label={props.localization?.submit || 'Submit'}
          type="submit"
          form={`edit-form-${uniqueId}`}
          variant="contained"
          color="primary">
          {props.localization?.submit || 'Submit'}
        </Button>
      </div>
    </>
  )
}
