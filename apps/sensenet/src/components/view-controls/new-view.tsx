/**
 * @module ViewControls
 */
import { FieldSetting } from '@sensenet/default-content-types'
import { useLogger, useRepository } from '@sensenet/hooks-react'
import { createStyles, makeStyles } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import clsx from 'clsx'
import React, { createElement, ReactElement, useCallback, useState } from 'react'
import MediaQuery from 'react-responsive'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { PATHS } from '../../application-paths'
import { globals, useGlobalStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'
import { navigateToAction } from '../../services'
import { defaultContentType } from '../edit/default-content-type'
import { NewTextFile } from '../edit/new-text-file'
import { reactControlMapper } from '../react-control-mapper'
import { ViewTitle } from './view-title'

const useStyles = makeStyles(() => {
  return createStyles({
    mainform: {
      width: '100%',
      height: `calc(100% - ${globals.common.formTitleHeight}px)`,
    },
    mainformFullPage: {
      height: `calc(100% - ${globals.common.drawerItemHeight}px)`,
    },
    form: {
      margin: '0 auto',
      padding: '22px 22px 0 22px',
      overflowY: 'auto',
      width: '100%',
      height: `calc(100% - ${globals.common.formActionButtonsHeight}px)`,
    },
    grid: {
      display: 'flex',
      alignItems: 'center',
      flexFlow: 'column',
      padding: '15px !important',
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
    actionButtonWrapper: {
      height: '80px',
      width: '100%',
      position: 'absolute',
      padding: '20px',
      bottom: 0,
      textAlign: 'right',
    },
  })
})

/**
 * Interface for NewView properties
 */
export interface NewViewProps {
  renderIcon?: (name: string) => ReactElement
  contentTypeName: string
  currentContentPath: string
  extension?: string
  uploadFolderpath?: string
  handleCancel?: () => void
  submitCallback?: () => void
  isFullPage?: boolean
}

/**
 * View Control for adding a Content, works with a single Content and based on the ReactControlMapper
 *
 * Usage:
 * ```html
 *  <NewView currentContentPath={content.Path} onSubmit={createSubmitClick} />
 * ```
 */
export const NewView: React.FC<NewViewProps> = (props) => {
  const repo = useRepository()
  const controlMapper = reactControlMapper(repo)
  const schema = controlMapper.getFullSchemaForContentType(props.contentTypeName, 'new')
  const [content, setContent] = useState({})
  const classes = useStyles()
  const localization = useLocalization()
  const globalClasses = useGlobalStyles()
  const logger = useLogger('AddDialog')
  const history = useHistory()
  const routeMatch = useRouteMatch<{ browseType: string; action?: string }>()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      const created = await repo.post({
        contentType: props.contentTypeName,
        parentPath: props.currentContentPath,
        content,
        contentTemplate: props.contentTypeName,
      })
      logger.information({
        message: localization.addButton.contentCreatedNotification.replace('{0}', created.d.Name || created.d.Path),
        data: {
          relatedContent: created,
          relatedRepository: repo.configuration.repositoryUrl,
        },
      })
    } catch (error) {
      logger.error({
        message: localization.addButton.errorPostingContentNotification,
        data: {
          details: { error },
        },
      })
    } finally {
      props.submitCallback?.()
    }
  }

  const handleInputChange = (field: string, value: unknown) => {
    setContent({ ...content, [field]: value })
  }

  const isFullWidthField = (field: { fieldSettings: FieldSetting }) => {
    return (
      field.fieldSettings.Name === 'Avatar' ||
      field.fieldSettings.Name === 'Enabled' ||
      field.fieldSettings.Type === 'LongTextFieldSetting'
    )
  }

  const loadDefaultContentType = useCallback(async () => {
    return defaultContentType
  }, [])

  if (props.contentTypeName === 'ContentType') {
    return (
      <NewTextFile
        contentTypeName={props.contentTypeName}
        routeMatch={routeMatch}
        savePath={PATHS.contentTypes.snPath}
        loadContent={loadDefaultContentType}
        getFileNameFromText={(text) => text.match(/<ContentType.*name="([^"]*)".*>/m)?.[1] || ''}
      />
    )
  } else if (props.contentTypeName === 'Resource') {
    return (
      <NewTextFile
        contentTypeName={props.contentTypeName}
        routeMatch={routeMatch}
        savePath={PATHS.localization.snPath}
        fileExtension={'.xml'}
        isFileNameEditable={true}
      />
    )
  } else if (props.contentTypeName === 'Settings') {
    return (
      <NewTextFile
        contentTypeName={props.contentTypeName}
        routeMatch={routeMatch}
        savePath={PATHS.setup.snPath}
        fileExtension={'.settings'}
        isFileNameEditable={true}
      />
    )
  }

  return (
    <>
      <ViewTitle title={'New'} titleBold={props.contentTypeName} />
      <form
        className={clsx(classes.mainform, {
          [classes.mainformFullPage]: props.isFullPage,
        })}
        onSubmit={handleSubmit}>
        <div className={classes.form}>
          <Grid container={true} spacing={2}>
            {schema.fieldMappings
              .sort((item1, item2) => (item2.fieldSettings.FieldIndex || 0) - (item1.fieldSettings.FieldIndex || 0))
              .map((field) => {
                const fieldControl = createElement(
                  controlMapper.getControlForContentField(props.contentTypeName, field.fieldSettings.Name, 'new'),
                  {
                    actionName: 'new',
                    settings: field.fieldSettings,
                    repository: repo,
                    renderIcon: props.renderIcon,
                    fieldOnChange: handleInputChange,
                    extension: props.extension,
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
          </Grid>
        </div>
        <div className={classes.actionButtonWrapper}>
          <MediaQuery minDeviceWidth={700}>
            <Button
              aria-label={localization.forms.cancel}
              color="default"
              className={globalClasses.cancelButton}
              onClick={() => {
                navigateToAction({ history, routeMatch })
                props.handleCancel?.()
              }}>
              {localization.forms.cancel}
            </Button>
          </MediaQuery>
          <Button aria-label={localization.forms.submit} variant="contained" color="primary" type="submit">
            {localization.forms.submit}
          </Button>
        </div>
      </form>
    </>
  )
}
