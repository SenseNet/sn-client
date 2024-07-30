/**
 * @module ViewControls
 */
import { Box, Button, createStyles, Grid, IconButton, makeStyles, Theme, Typography } from '@material-ui/core'
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons'
import { Repository } from '@sensenet/client-core'
import { ActionName, ControlMapper } from '@sensenet/control-mapper'
import { FieldSetting, FieldVisibility, GenericContent } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import type { Locale } from 'date-fns'
import React, { createElement, ReactElement, useEffect, useRef, useState } from 'react'
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
    advancedFields?: string
    cancel?: string
    submit?: string
  }
  hideDescription?: boolean
  classes?: EditViewClassKey
  controlMapper?: ControlMapper<any, any>
  fieldLocalization?: FieldLocalization
  locale?: Locale
}

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    grid: {
      margin: '0 auto',
      maxWidth: '850px',
    },
    fieldWrapper: {},
    field: {},
    fieldFullWidth: {
      width: '100%',
    },
    actionButtonWrapper: {
      textAlign: 'right',
    },
    cancel: {
      marginRight: 20,
    },
    advancedFieldContainer: {
      padding: '15px',
      fontSize: '18px',
      width: '100%',
    },
    advancedFieldBox: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      margin: '0 auto',
    },
    divider: {
      height: '1px',
      margin: '16px auto',
      backgroundColor: theme.palette.primary.main,
    },
  })
})

export interface AdvancedFieldGroup {
  key: string
  fields: Array<{ fieldSettings: FieldSetting; actionName: ActionName; controlType: any }>
}

export const DEFAULT_GROUP_KEY = 'DEFAULT_GROUP_KEY'

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
  const [advancedFields, setAdvancedFields] = useState<AdvancedFieldGroup[]>([])
  const [advancedFieldStateGroup, setAdvancedFieldStateGroup] = useState<Array<{ key: string; isOpened: boolean }>>([])
  const contentRef = useRef({})
  const [content, setContent] = useState(contentRef.current)
  contentRef.current = content
  const classes = useStyles(props)
  const repository = useRepository()

  const uniqueId = Date.now()

  let isAutofocusSet = false

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    props.onSubmit?.(content, schema.schema.ContentTypeName)
  }

  const handleInputChange = (field: string, value: unknown) => {
    setContent({ ...contentRef.current, [field]: value })
  }

  useEffect(() => {
    const schemaObservable = repository.schemas.subscribeToSchemas(() => {
      setSchema(() => controlMapper.getFullSchemaForContentType(props.contentTypeName, actionName))
    })
    return () => schemaObservable.dispose()
  }, [repository.schemas, actionName, controlMapper, props.contentTypeName])

  useEffect(() => {
    if (actionName && schema) {
      const groups: AdvancedFieldGroup[] = [
        {
          key: DEFAULT_GROUP_KEY,
          fields: [],
        },
      ]

      schema.fieldMappings.forEach((e) => {
        if (
          (actionName === 'edit' && e.fieldSettings.VisibleEdit === FieldVisibility.Advanced) ||
          (actionName === 'new' && e.fieldSettings.VisibleNew === FieldVisibility.Advanced)
        ) {
          const category = e.fieldSettings.Customization?.Categories?.split(' ')[0]
          if (category) {
            const group = groups.find((g) => g.key === category)
            if (group) {
              group.fields.push(e)
            } else {
              groups.push({
                key: category,
                fields: [e],
              })
            }
          } else {
            groups.find((g) => g.key === DEFAULT_GROUP_KEY)?.fields.push(e)
          }
        }
      })

      setAdvancedFieldStateGroup(
        groups.map((g) => {
          return { key: g.key, isOpened: false }
        }),
      )
      setAdvancedFields(groups)
    }
  }, [actionName, schema])

  const renderField = (field: { fieldSettings: FieldSetting; actionName: ActionName; controlType: any }) => {
    field.fieldSettings.DisplayName = field.fieldSettings.DisplayName ?? field.fieldSettings.Name
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

    const isFullWidth = isFullWidthField(
      field,
      props.content || ({ Type: props.contentTypeName } as GenericContent),
      repository,
    )

    if (autoFocus) {
      isAutofocusSet = true
    }

    return (
      <Grid
        item={true}
        xs={12}
        sm={12}
        md={12}
        lg={12}
        xl={12}
        key={field.fieldSettings.Name}
        className={classes.fieldWrapper}>
        <div className={isFullWidth ? classes.fieldFullWidth : classes.field}>{fieldControl}</div>
      </Grid>
    )
  }

  const toggleAdvancedFieldGroup = (key: string) => {
    setAdvancedFieldStateGroup((prevItems) =>
      prevItems.map((item) => (item.key === key ? { ...item, isOpened: !item.isOpened } : item)),
    )
  }

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
          .filter(
            (i) =>
              !advancedFields
                .flatMap((g) => g.fields)
                .map((g) => g.fieldSettings.Name)
                .includes(i.fieldSettings.Name),
          )
          .sort((item1, item2) => (item2.fieldSettings.FieldIndex || 0) - (item1.fieldSettings.FieldIndex || 0))
          .map((field) => renderField(field))}

        <Box className={classes.advancedFieldContainer}>
          {advancedFields.map((group, index) =>
            group.fields.length > 0 ? (
              <Box key={index} data-test="group-container">
                <Box className={classes.divider} />
                <Box data-test="group-header">
                  <Box className={classes.advancedFieldBox}>
                    <span data-test="advanced-field-group-title">{`${
                      props.localization?.advancedFields ?? 'Advanced fields'
                    }${group.key === DEFAULT_GROUP_KEY ? '' : ` - ${group.key}`}`}</span>
                    <IconButton onClick={() => toggleAdvancedFieldGroup(group.key)}>
                      {advancedFieldStateGroup.find((g) => g.key === group.key)?.isOpened ? (
                        <KeyboardArrowUp />
                      ) : (
                        <KeyboardArrowDown />
                      )}
                    </IconButton>
                  </Box>
                </Box>
                {advancedFieldStateGroup.find((g) => g.key === group.key)?.isOpened &&
                  group.fields
                    .sort(
                      (item1, item2) => (item2.fieldSettings.FieldIndex || 0) - (item1.fieldSettings.FieldIndex || 0),
                    )
                    .map((field) => renderField(field))}
              </Box>
            ) : (
              <></>
            ),
          )}
        </Box>
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
          data-test="submit"
          form={`edit-form-${uniqueId}`}
          variant="contained"
          color="primary">
          {props.localization?.submit || 'Submit'}
        </Button>
      </div>
    </>
  )
}
