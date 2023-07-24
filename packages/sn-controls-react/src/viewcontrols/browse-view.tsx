/**
 * @module ViewControls
 */
import { Button, createStyles, Grid, makeStyles, Typography } from '@material-ui/core'
import { Repository } from '@sensenet/client-core'
import { ControlMapper } from '@sensenet/control-mapper'
import { GenericContent } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import type { Locale } from 'date-fns'
import React, { createElement, ReactElement, useEffect, useState } from 'react'
import { FieldLocalization } from '../fieldcontrols/localization'
import { isFullWidthField } from '../helpers'
import { reactControlMapper } from '../react-control-mapper'

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
    close?: string
  }
  fieldLocalization?: FieldLocalization
  classes?: BrowseViewClassKey
  locale?: Locale
}

const useStyles = makeStyles(() => {
  return createStyles({
    grid: {},
    fieldWrapper: {},
    field: {},
    fieldFullWidth: {},
    actionButtonWrapper: {
      textAlign: 'right',
    },
    cancel: {},
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
  const repository = useRepository()

  useEffect(() => {
    const schemaObservable = repository.schemas.subscribeToSchemas(() => {
      setSchema(() => controlMapper.getFullSchemaForContentType(props.content.Type, 'browse'))
    })
    return () => schemaObservable.dispose()
  }, [repository.schemas, props.content.Type, controlMapper])

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
          .sort((item1, item2) => (item2.fieldSettings.FieldIndex || 0) - (item1.fieldSettings.FieldIndex || 0))
          .map((field) => {
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
          })}
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
