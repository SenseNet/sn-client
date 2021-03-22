/**
 * @module ViewControls
 */
import { Repository } from '@sensenet/client-core'
import { ActionName, ControlMapper } from '@sensenet/control-mapper'
import { GenericContent } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import createStyles from '@material-ui/core/styles/createStyles'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Typography from '@material-ui/core/Typography'
import type { Locale } from 'date-fns'
import React, { createElement, ReactElement, useEffect, useState } from 'react'
import MediaQuery from 'react-responsive'
import { FieldLocalization } from '../fieldcontrols/localization'
import { isFullWidthField } from '../helpers'
import { reactControlMapper } from '../react-control-mapper'

const hasInputField = ['Name', 'FileName', 'ShortText', 'AutoComplete', 'Textarea', 'NumberField', 'RichTextEditor']

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
  hideDescription?: boolean
  classes?: EditViewClassKey
  controlMapper?: ControlMapper<any, any>
  fieldLocalization?: FieldLocalization
  locale?: Locale
}

const useStyles = makeStyles(() => {
  return createStyles({
    grid: {
      margin: '0 auto',
    },
    fieldWrapper: {},
    field: {},
    fieldFullWidth: {},
    actionButtonWrapper: {
      textAlign: 'right',
    },
    cancel: {
      marginRight: 20,
    },
  })
})

type EditViewClassKey = Partial<ReturnType<typeof useStyles>>

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
  const classes = useStyles(props)
  const repository = useRepository()

  const uniqueId = Date.now()

  let isAutofocusSet = false

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    props.onSubmit?.(content, schema.schema.ContentTypeName)
  }

  const handleInputChange = (field: string, value: unknown) => {
    setContent({ ...content, [field]: value })
  }

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
        className={classes.grid}>
        {schema.fieldMappings
          .sort((item1, item2) => (item2.fieldSettings.FieldIndex || 0) - (item1.fieldSettings.FieldIndex || 0))
          .map((field) => {
            const autoFocus = hasInputField.includes(field.controlType.name) && !isAutofocusSet
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
                hideDescription: props.hideDescription,
                uploadFolderPath: props.uploadFolderpath,
                autoFocus,
                localization: props.fieldLocalization,
                locale: props.locale,
              },
            )

            const isFullWidth = isFullWidthField(field, props.contentTypeName)

            if (autoFocus) {
              isAutofocusSet = true
            }

            return (
              <Grid
                item={true}
                xs={12}
                sm={12}
                md={isFullWidth ? 12 : 6}
                lg={isFullWidth ? 12 : 6}
                xl={isFullWidth ? 12 : 6}
                key={field.fieldSettings.Name}
                className={classes.fieldWrapper}>
                <div className={isFullWidth ? classes.fieldFullWidth : classes.field}>{fieldControl}</div>
              </Grid>
            )
          })}
      </Grid>
      <div className={classes.actionButtonWrapper}>
        <MediaQuery minDeviceWidth={700}>
          <Button
            aria-label={props.localization?.cancel || 'Cancel'}
            data-test="cancel"
            color="default"
            className={classes.cancel}
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
