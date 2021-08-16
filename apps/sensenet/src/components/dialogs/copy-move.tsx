import { PathHelper } from '@sensenet/client-utils'
import { GenericContent } from '@sensenet/default-content-types'
import { useLogger, useRepository } from '@sensenet/hooks-react'
import { GenericContentWithIsParent, Picker } from '@sensenet/pickers-react'
import { LinearProgress } from '@material-ui/core'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import React, { useEffect, useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useGlobalStyles } from '../../globalStyles'
import { useLocalization, useQuery, useSnRoute } from '../../hooks'
import { navigateToAction } from '../../services'
import { Icon } from '../Icon'
import { DialogTitle, useDialog } from '.'

export interface CopyMoveDialogProps {
  currentParent: GenericContent
  content: GenericContent[]
  operation: 'copy' | 'move'
}

export const CopyMoveDialog: React.FunctionComponent<CopyMoveDialogProps> = (props) => {
  const snRoute = useSnRoute()
  const repo = useRepository()
  const { closeLastDialog } = useDialog()
  const history = useHistory()
  const currentPath = useQuery().get('path')
  const localizations = useLocalization().copyMoveContentDialog
  const logger = useLogger('CopyDialog')
  const globalClasses = useGlobalStyles()

  const [localization, setLocalization] = useState(localizations[props.operation])
  const [isExecInProgress, setIsExecInProgress] = useState(false)

  const selectionRoots = useMemo(() => [snRoute.path], [snRoute.path])
  const itemsODataOptions = useMemo(() => ({ filter: '' }), [])

  const blackList =
    props.operation === 'copy'
      ? [props.content[0].Path]
      : [props.content[0].Path, `/${PathHelper.getParentPath(props.content[0].Path)}`]

  useEffect(() => {
    setLocalization(localizations[props.operation])
  }, [localizations, props.operation])

  if (!props.content.length) {
    return null
  }

  const handleSubmit = async (selection: GenericContentWithIsParent[]) => {
    try {
      const target = selection[0]

      setIsExecInProgress(true)

      const action = props.operation === 'copy' ? repo.copy : repo.move
      const result = await action({ idOrPath: props.content.map((c) => c.Id), targetPath: target.Path })

      if (result.d.errors.length === 1) {
        return logger.warning({
          message: `${localization.copyFailedNotification
            .replace('{0}', result.d.errors[0].content.Name)
            .replace('{1}', target.DisplayName || target.Name)}\r\n${result.d.errors[0].error.message.value}`,
          data: {
            details: result,
            ...(props.content.length === 1
              ? {
                  relatedRepository: repo.configuration.repositoryUrl,
                  relatedContent: props.content[0],
                }
              : {}),
          },
        })
      } else if (result.d.errors.length > 1) {
        return logger.warning({
          message: localization.copyMultipleFailedNotification
            .replace('{0}', result.d.errors.length.toString())
            .replace('{1}', target.DisplayName || target.Name),
          data: {
            details: result,
          },
        })
      }

      if (result.d.results.length === 1) {
        logger.information({
          message: localization.copySucceededNotification
            .replace('{0}', result.d.results[0].Name)
            .replace('{1}', target.Path),
          data: {
            error: result.d.errors[0],
            ...(props.content.length === 1
              ? {
                  relatedRepository: repo.configuration.repositoryUrl,
                  relatedContent: props.content[0],
                }
              : {}),
          },
        })
      } else if (result.d.results.length > 1) {
        logger.information({
          message: localization.copyMultipleSucceededNotification
            .replace('{0}', result.d.results.length.toString())
            .replace('{1}', target.DisplayName || target.Name),
          data: {
            error: result.d.errors,
          },
        })
      }

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
    } catch (error) {
      /** */
    } finally {
      setIsExecInProgress(false)
      closeLastDialog()
    }
  }

  return (
    <>
      <DialogTitle>
        <div className={globalClasses.centeredVertical}>
          <Icon item={props.content[0]} style={{ marginRight: '1em' }} />
          {isExecInProgress
            ? localization.inProgress
            : props.content.length === 1
            ? localization.title.replace('{0}', props.content[0].DisplayName || props.content[0].Name)
            : localization.titleMultiple.replace('{0}', props.content.length.toString())}
        </div>
      </DialogTitle>
      <Picker
        repository={repo}
        currentPath={props.currentParent.Path}
        selectionRoots={selectionRoots}
        itemsODataOptions={itemsODataOptions}
        renderIcon={(item) => <Icon item={item} />}
        renderLoading={() => <LinearProgress />}
        pickerContainer={DialogContent}
        actionsContainer={DialogActions}
        handleCancel={closeLastDialog}
        handleSubmit={handleSubmit}
        selectionBlacklist={blackList}
        isExecInProgress={isExecInProgress}
        required={1}
        classes={{ cancelButton: globalClasses.cancelButton }}
      />
    </>
  )
}

export default CopyMoveDialog
