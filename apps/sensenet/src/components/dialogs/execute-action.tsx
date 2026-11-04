import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import LinearProgress from '@material-ui/core/LinearProgress'
import Typography from '@material-ui/core/Typography'
import { useInjector, useLogger, useRepository } from '@sensenet/hooks-react'
import React, { lazy, useEffect, useState } from 'react'
import { useGlobalStyles } from '../../globalStyles'
import { useLocalization, useTheme } from '../../hooks'
import {
  CustomActionCommandProvider,
  OnExecuteActionPayload,
} from '../../services/CommandProviders/CustomActionCommandProvider'
import { executeCustomAction } from '../../services/execute-custom-action'
import { createCustomActionModel } from '../../services/MonacoModels/create-custom-action-model'
import { getMonacoModelUri } from '../editor/text-editor'
import { DialogTitle, useDialog } from '.'
const MonacoEditor = lazy(() => import('react-monaco-editor'))

const EDITOR_INITIAL_VALUE = `{

}`

export type ExecuteActionDialogProps = {
  actionValue: OnExecuteActionPayload
}

export function ExecuteActionDialog({ actionValue }: ExecuteActionDialogProps) {
  const theme = useTheme()
  const { closeLastDialog } = useDialog()
  const localization = useLocalization().customActions.executeCustomActionDialog
  const customActionService = useInjector().getInstance(CustomActionCommandProvider)
  const logger = useLogger('ExecuteAction')
  const repo = useRepository()
  const globalClasses = useGlobalStyles()

  const [uri, setUri] = useState<import('react-monaco-editor').monaco.Uri>()
  const [postBody, setPostBody] = useState(EDITOR_INITIAL_VALUE)
  const [isExecuting, setIsExecuting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    ;(async () => {
      setUri(await getMonacoModelUri(actionValue.content, repo, actionValue.action))
    })()
  }, [actionValue, repo])

  useEffect(() => {
    if (uri && actionValue && actionValue.metadata) {
      createCustomActionModel(uri, actionValue.metadata)
    }
  }, [uri, actionValue])

  const getActionResult = async () => {
    setIsExecuting(true)
    setError('')
    try {
      return await executeCustomAction(repo, actionValue, postBody)
    } catch (e) {
      setError(e.message)
      logger.error({
        message: `There was an error executing custom action '${
          actionValue.action.DisplayName || actionValue.action.Name
        }'`,
        data: {
          isDismissed: true,
          relatedRepository: repo.configuration.repositoryUrl,
          relatedContent: actionValue.content,
          error,
          details: { actionValue },
        },
      })
    } finally {
      setIsExecuting(false)
    }
  }

  const onClick = async () => {
    const result = await getActionResult()

    if (!result) {
      return
    }
    setPostBody(EDITOR_INITIAL_VALUE)

    customActionService.onActionExecuted.setValue({
      action: actionValue.action,
      content: actionValue.content,
      response: result,
    })

    logger.information({
      message: `Action executed: '${actionValue.action.DisplayName || actionValue.action.Name}'`,
      data: {
        relatedContent: actionValue.content,
        relatedRepository: repo.configuration.repositoryUrl,
        details: { actionValue, result },
      },
    })
  }

  return (
    <>
      <DialogTitle>
        {localization.title
          .replace('{0}', (actionValue && (actionValue.action.DisplayName || actionValue.action.Name)) || '')
          .replace('{1}', (actionValue && (actionValue.content.DisplayName || actionValue.content.Name)) || '')}
      </DialogTitle>
      <DialogContent style={{ overflow: 'hidden' }}>
        {!uri ? (
          <div>
            <LinearProgress />
          </div>
        ) : isExecuting ? (
          <div>
            <Typography>{localization.executingAction}</Typography>
            <LinearProgress />
          </div>
        ) : (
          <>
            {actionValue?.metadata?.parameters?.length ? (
              <MonacoEditor
                height={'100%'}
                theme={theme.palette.type === 'dark' ? 'vs-dark' : 'vs-light'}
                width="100%"
                language="json"
                value={postBody}
                onChange={(v) => setPostBody(v)}
                options={{
                  automaticLayout: true,
                  lineNumbers: 'off',
                }}
                editorDidMount={(editor, monaco) => {
                  if (!uri) {
                    return
                  }
                  const model = monaco.editor.getModel(uri)
                  if (!model) {
                    const m = monaco.editor.createModel(postBody, 'json', uri)
                    editor.setModel(m)
                  } else {
                    editor.setModel(model)
                    setPostBody(model.getValue())
                  }
                }}
              />
            ) : (
              <Typography>{localization.noParameters}</Typography>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <div style={{ flex: 1, marginLeft: '1.5em' }}>
          {error ? <Typography color="error">{error}</Typography> : null}
        </div>
        <Button aria-label={localization.cancelButton} className={globalClasses.cancelButton} onClick={closeLastDialog}>
          {localization.cancelButton}
        </Button>
        <Button
          aria-label={localization.executeButton}
          color="primary"
          variant="contained"
          autoFocus={!actionValue?.metadata?.parameters?.length}
          onClick={onClick}>
          {localization.executeButton}
        </Button>
      </DialogActions>
    </>
  )
}

export default ExecuteActionDialog
