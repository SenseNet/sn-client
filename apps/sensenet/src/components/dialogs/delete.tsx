import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import LinearProgress from '@material-ui/core/LinearProgress'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import { PathHelper } from '@sensenet/client-utils'
import { GenericContent } from '@sensenet/default-content-types'
import { useLogger, useRepository } from '@sensenet/hooks-react'
import React, { useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { ResponsiveContext } from '../../context'
import { useGlobalStyles } from '../../globalStyles'
import { useLocalization, useQuery, useSelectionService, useSnRoute } from '../../hooks'
import { navigateToAction } from '../../services'
import { Icon } from '../Icon'
import { DialogTitle, useDialog } from '.'

export type DeleteContentDialogProps = {
  content: GenericContent[]
}

export const DeleteContentDialog: React.FunctionComponent<DeleteContentDialogProps> = (props) => {
  const device = useContext(ResponsiveContext)
  const { closeLastDialog } = useDialog()
  const [isDeleteInProgress, setIsDeleteInProgress] = useState(false)
  const [permanent, setPermanent] = useState(false)
  const repo = useRepository()
  const history = useHistory()
  const localization = useLocalization().deleteContentDialog
  const logger = useLogger('DeleteContentDialog')
  const isTrashBag = !!props.content.length && repo.schemas.isContentFromType(props.content[0], 'TrashBag')
  const globalClasses = useGlobalStyles()
  const selectionService = useSelectionService()
  const snRoute = useSnRoute()
  const currentPath = useQuery().get('path')
  const hasUserOrGroupContent = props.content.some(
    (content) => repo.schemas.isContentFromType(content, 'User') || repo.schemas.isContentFromType(content, 'Group'),
  )

  return (
    <>
      {isDeleteInProgress ? (
        <DialogTitle>{localization.deletingContent}</DialogTitle>
      ) : (
        <DialogTitle>{localization.dialogTitle}</DialogTitle>
      )}
      <DialogContent>
        <Typography>{localization.dialogContent}</Typography>
        <List dense={device === 'mobile'}>
          {props.content.map((c) => (
            <ListItem key={c.Id}>
              <ListItemIcon>
                <Icon item={c} />
              </ListItemIcon>
              <ListItemText primary={c.DisplayName || c.Name} secondary={c.Path} />
            </ListItem>
          ))}
        </List>
        {hasUserOrGroupContent && <Typography>{localization.additionalTextForUsers}</Typography>}
        {isDeleteInProgress ? <LinearProgress /> : null}
      </DialogContent>
      <DialogActions
        style={{
          display: 'flex',
          justifyContent: isTrashBag || hasUserOrGroupContent ? 'flex-end' : 'space-between',
        }}>
        {!isTrashBag && !hasUserOrGroupContent ? (
          <>
            <Tooltip title={localization.permanentlyHint}>
              <FormControlLabel
                style={{ marginLeft: '1em' }}
                label={localization.permanentlyLabel}
                control={
                  <Checkbox
                    color="primary"
                    data-test="delete-permanently"
                    disabled={isDeleteInProgress}
                    onChange={(ev) => setPermanent(ev.target.checked)}
                  />
                }
              />
            </Tooltip>
          </>
        ) : null}
        <div>
          <Button
            aria-label={localization.cancelButton}
            className={globalClasses.cancelButton}
            disabled={isDeleteInProgress}
            onClick={() => closeLastDialog()}>
            {localization.cancelButton}
          </Button>
          <Button
            aria-label={isTrashBag ? localization.deletePermanently : localization.deleteButton}
            color="primary"
            variant="contained"
            autoFocus={true}
            disabled={isDeleteInProgress}
            data-test="button-delete-confirm"
            onClick={async () => {
              try {
                setIsDeleteInProgress(true)
                const result = await repo.delete({
                  idOrPath: props.content.map((c) => c.Path),
                  permanent,
                })
                if (result.d.results.length) {
                  logger.information({
                    message:
                      result.d.results.length > 1
                        ? localization.deleteMultipleSuccessNotification.replace(
                            '{0}',
                            result.d.results.length.toString(),
                          )
                        : localization.deleteSuccessNotification.replace('{0}', result.d.results[0].Name),
                    data: {
                      relatedContent: props.content.length > 1 ? undefined : props.content[0],
                      relatedRepository: repo.configuration.repositoryUrl,
                    },
                  })
                }
                if (result.d.errors.length) {
                  logger.warning({
                    message:
                      result.d.errors.length > 1
                        ? localization.deleteMultipleContentFailedNotification.replace(
                            '{0}',
                            result.d.errors.length.toString(),
                          )
                        : localization.deleteSingleContentFailedNotification
                            .replace(
                              '{0}',
                              (props.content.find((c) => c.Id === result.d.errors[0].content.Id) as GenericContent)
                                .DisplayName ||
                                (props.content.find((c) => c.Id === result.d.errors[0].content.Id) as GenericContent)
                                  .Name ||
                                result.d.errors[0].content.Name,
                            )
                            .replace('{1}', result.d.errors[0].error.message.value),
                    data: {
                      relatedContent: props.content.length > 1 ? undefined : props.content[0],
                      relatedRepository: repo.configuration.repositoryUrl,
                      error: result.d.errors.length > 1 ? result.d.errors : result.d.errors[0],
                    },
                  })
                } else {
                  if (
                    props.content.some((currentContent) =>
                      PathHelper.isInSubTree(`${snRoute.path}${currentPath || ''}`, currentContent.Path),
                    )
                  ) {
                    navigateToAction({
                      history,
                      routeMatch: snRoute.match,
                      queryParams: {
                        path: `/${PathHelper.getParentPath(props.content[0].Path)}`.replace(snRoute.path, ''),
                      },
                    })
                  }
                }
              } catch (error) {
                logger.error({
                  message: localization.deleteFailedNotification,
                  data: {
                    error,
                  },
                })
              } finally {
                selectionService.selection.setValue([])
                setIsDeleteInProgress(false)
                closeLastDialog()
              }
            }}>
            {isTrashBag ? localization.deletePermanently : localization.deleteButton}
          </Button>
        </div>
      </DialogActions>
    </>
  )
}

export default DeleteContentDialog
