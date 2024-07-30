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
import React, { createElement, ReactElement, useEffect, useState } from 'react'
import { FieldLocalization } from '../fieldcontrols/localization'
import { isFullWidthField } from '../helpers'
import { reactControlMapper } from '../react-control-mapper'
import { AdvancedFieldGroup, DEFAULT_GROUP_KEY } from './edit-view'

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
    advancedFields?: string
    close?: string
  }
  fieldLocalization?: FieldLocalization
  classes?: BrowseViewClassKey
  locale?: Locale
}

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    grid: {
      margin: '0 auto',
      maxWidth: '750px',
    },
    fieldWrapper: {},
    field: {},
    fieldFullWidth: {},
    actionButtonWrapper: {
      textAlign: 'right',
    },
    cancel: {},
    advancedFieldContainer: {
      padding: '15px',
      fontSize: '18px',
      width: '100%',
    },
    advancedFieldBox: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '88%',
      margin: '0 auto',
    },
    divider: {
      width: '88%',
      height: '1px',
      margin: '16px auto',
      backgroundColor: theme.palette.primary.main,
    },
  })
})

type BrowseViewClassKey = Partial<ReturnType<typeof useStyles>>

/**
 * View Control for browsing a Content, works with a single Content and based on the ReactControlMapper
 */
export const BrowseView: React.FC<BrowseViewProps> = (props) => {
  const controlMapper = props.controlMapper || reactControlMapper(props.repository)
  const [schema, setSchema] = useState(controlMapper.getFullSchemaForContentType(props.content.Type, 'browse'))
  const classes = useStyles(props)
  const [advancedFields, setAdvancedFields] = useState<AdvancedFieldGroup[]>([])
  const [advancedFieldStateGroup, setAdvancedFieldStateGroup] = useState<Array<{ key: string; isOpened: boolean }>>([])
  const repository = useRepository()

  useEffect(() => {
    const schemaObservable = repository.schemas.subscribeToSchemas(() => {
      setSchema(() => controlMapper.getFullSchemaForContentType(props.content.Type, 'browse'))
    })
    return () => schemaObservable.dispose()
  }, [repository.schemas, props.content.Type, controlMapper])

  useEffect(() => {
    if (schema) {
      const groups: AdvancedFieldGroup[] = [
        {
          key: DEFAULT_GROUP_KEY,
          fields: [],
        },
      ]

      schema.fieldMappings.forEach((e) => {
        if (e.fieldSettings.VisibleBrowse === FieldVisibility.Advanced) {
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
  }, [schema])

  const renderField = (field: { fieldSettings: FieldSetting; actionName: ActionName; controlType: any }) => {
    const isFullWidth = isFullWidthField(field, props.content, repository)

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
        <div className={isFullWidth ? classes.fieldFullWidth : classes.field}>
          {createElement(
            controlMapper.getControlForContentField(props.content.Type, field.fieldSettings.Name, 'browse'),
            {
              actionName: 'browse',
              settings: field.fieldSettings,
              content: props.content,
              fieldValue: (props.content as any)[field.fieldSettings.Name],
              renderIcon: props.renderIcon,
              repository: props.repository,
              localization: props.fieldLocalization,
              locale: props.locale,
            },
          )}
        </div>
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
      {props.renderTitle ? (
        props.renderTitle()
      ) : (
        <Typography variant="h5" gutterBottom={true}>
          {schema.schema.DisplayName}
        </Typography>
      )}
      <Grid container={true} spacing={2} className={classes.grid}>
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

        <Box className={classes.advancedFieldContainer} data-test="advanced-field-container">
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
        <Button
          aria-label={props.localization?.close || 'Close'}
          color="default"
          className={classes.cancel}
          onClick={() => props.handleCancel?.()}>
          {props.localization?.close || 'Close'}
        </Button>
      </div>
    </>
  )
}
