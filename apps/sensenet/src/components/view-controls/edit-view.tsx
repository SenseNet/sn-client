/**
 * @module ViewControls
 */
import { isExtendedError } from '@sensenet/client-core'
import { PathHelper } from '@sensenet/client-utils/src/path-helper'
import { FieldSetting } from '@sensenet/default-content-types'
import { useLogger, useRepository } from '@sensenet/hooks-react'
import { createStyles, makeStyles } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import clsx from 'clsx'
import React, { createElement, ReactElement, useEffect, useState } from 'react'
import MediaQuery from 'react-responsive'
import { globals, useGlobalStyles } from '../../globalStyles'
import { useDialogActionService, useLocalization, useSelectionService } from '../../hooks'
import { ActionNameType, reactControlMapper } from '../react-control-mapper'

const useStyles = makeStyles(() => {
  return createStyles({
    form: {
      margin: '0 auto',
      padding: '22px 22px 0 22px',
      overflowY: 'auto',
      width: '100%',
      height: `calc(100% - ${globals.common.formActionButtonsHeight}px)`,
    },
    formFullPage: {
      height: `calc(100% - ${globals.common.formActionButtonsHeight + globals.common.drawerItemHeight}px)`,
    },
    mainForm: {
      display: 'initial',
      height: `calc(100% - ${globals.common.formTitleHeight}px)`,
    },
    mainFormFullpage: {
      height: `calc(100% - ${globals.common.drawerItemHeight}px)`,
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
 * Interface for EditView properties
 */
export interface EditViewProps {
  renderIcon?: (name: string) => ReactElement
  handleCancel?: () => void
  submitCallback?: () => void
  uploadFolderpath?: string
  actionName?: ActionNameType
  isFullPage?: boolean
}

/**
 * View Control for editing a Content, works with a single Content and based on the ReactControlMapper
 *
 * Usage:
 * ```html
 *  <EditView content={selectedContent} onSubmit={editSubmitClick} />
 * ```
 */
export const EditView: React.FC<EditViewProps> = (props) => {
  const repo = useRepository()
  const selectionService = useSelectionService()
  const [content, setContent] = useState(selectionService.activeContent.getValue())
  const controlMapper = reactControlMapper(repo)
  const [saveableFields, setSaveableFields] = useState({})
  const classes = useStyles()
  const globalClasses = useGlobalStyles()
  const localization = useLocalization()
  const logger = useLogger('EditView')
  const dialogActionService = useDialogActionService()

  useEffect(() => {
    async function getExpandedContent() {
      const expanedContentResponse = await repo.load({
        idOrPath: selectionService.activeContent.getValue()!.Id,
        oDataOptions: {
          select: 'all',
          expand: ['Manager', 'FollowedWorkspaces', 'ModifiedBy'] as any,
        },
      })
      setContent(expanedContentResponse.d)
    }
    selectionService.activeContent.getValue() && getExpandedContent()
  }, [])

  useEffect(() => {
    const activeComponentObserve = selectionService.activeContent.subscribe(async (newActiveComponent) => {
      if (newActiveComponent) {
        const expandedContent = await repo.load({
          idOrPath: newActiveComponent?.Id,
          oDataOptions: {
            select: 'all',
            expand: ['Manager', 'FollowedWorkspaces', 'ModifiedBy'] as any,
          },
        })
        setContent(expandedContent.d)
      }
    })
    return function cleanup() {
      activeComponentObserve.dispose()
    }
  }, [repo, selectionService.activeContent])

  if (content === undefined) {
    return null
  } else {
    const schema = controlMapper.getFullSchemaForContentType(
      content.Type,
      props.actionName ? props.actionName : 'browse',
    )

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      try {
        const response = repo.patch({
          idOrPath: content.Id,
          content: saveableFields,
        })
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
      } catch (error) {
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
      } finally {
        props.submitCallback && props.submitCallback()
      }
    }

    const handleInputChange = (field: string, value: unknown) => {
      setSaveableFields({ ...saveableFields, [field]: value })
    }

    const isFullWidthField = (field: { fieldSettings: FieldSetting }) => {
      return (
        (field.fieldSettings.Name === 'Avatar' && content.Type.includes('User')) ||
        (field.fieldSettings.Name === 'Enabled' && content.Type.includes('User')) ||
        field.fieldSettings.Type === 'LongTextFieldSetting'
      )
    }

    return (
      <form
        className={clsx(classes.mainForm, {
          [classes.mainFormFullpage]: props.isFullPage,
        })}
        onSubmit={handleSubmit}>
        <div
          className={clsx(classes.form, {
            [classes.formFullPage]: props.isFullPage,
          })}>
          <Grid container={true} spacing={2}>
            {schema.fieldMappings
              .sort((item1, item2) => (item2.fieldSettings.FieldIndex || 0) - (item1.fieldSettings.FieldIndex || 0))
              .map((field) => {
                const fieldControl = createElement(
                  controlMapper.getControlForContentField(
                    content.Type,
                    field.fieldSettings.Name,
                    props.actionName ? props.actionName : 'browse',
                  ),
                  {
                    repository: repo,
                    settings: field.fieldSettings,
                    content,
                    fieldValue: (content as any)[field.fieldSettings.Name],
                    actionName: props.actionName,
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
                    key={field.fieldSettings.Name + content.Id}
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
              color="default"
              className={globalClasses.cancelButton}
              onClick={async () => {
                if (selectionService.activeContent.getValue() !== undefined) {
                  const parentContent = await repo.load({
                    idOrPath: PathHelper.getParentPath(selectionService.activeContent.getValue()!.Path),
                  })
                  selectionService.activeContent.setValue(parentContent.d)
                }
                dialogActionService.activeAction.setValue(undefined)
                props.handleCancel?.()
              }}>
              {localization.forms.cancel}
            </Button>
          </MediaQuery>
          {props.actionName !== 'browse' && (
            <Button variant="contained" color="primary" type="submit">
              {localization.forms.submit}
            </Button>
          )}
        </div>
      </form>
    )
  }
}
