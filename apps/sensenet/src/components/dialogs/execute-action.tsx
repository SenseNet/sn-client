import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import LinearProgress from '@material-ui/core/LinearProgress'
import Typography from '@material-ui/core/Typography'
import React, { useEffect, useState } from 'react'
import MonacoEditor from 'react-monaco-editor'
import { useInjector, useLogger, useRepository } from '@sensenet/hooks-react'
import { PathHelper } from '@sensenet/client-utils'
import { useLocalization, useTheme } from '../../hooks'
import { CustomActionCommandProvider } from '../../services/CommandProviders/CustomActionCommandProvider'
import { createCustomActionModel } from '../../services/MonacoModels/create-custom-action-model'
import { getMonacoModelUri } from '../edit/TextEditor'

const postBodyCache = new Map<string, string>()
const EDITOR_INITIAL_VALUE = `{

}`

export const ExecuteActionDialog: React.FunctionComponent = () => {
  const theme = useTheme()

  const localization = useLocalization().customActions.executeCustomActionDialog
  const customActionService = useInjector().getInstance(CustomActionCommandProvider)
  const logger = useLogger('ExecuteAction')
  const repo = useRepository()

  const [actionValue, setActionValue] = useState(customActionService.onExecuteAction.getValue())

  const [isVisible, setIsVisible] = useState(false)
  const [postBody, setPostBody] = useState(EDITOR_INITIAL_VALUE)
  const [uri, setUri] = useState<import('monaco-editor').Uri>()

  const [isExecuting, setIsExecuting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    uri && postBodyCache.set(uri.toString(), postBody)
  }, [postBody, uri])

  useEffect(() => {
    const stored = uri && postBodyCache.get(uri.toString())
    if (stored) {
      setPostBody(stored)
    } else {
      setPostBody(EDITOR_INITIAL_VALUE)
    }
    setError('')
  }, [uri])

  useEffect(() => {
    if (uri && actionValue && actionValue.metadata) {
      createCustomActionModel(uri, actionValue.metadata)
    }
  }, [uri, actionValue])

  useEffect(() => {
    const observables = [
      customActionService.onExecuteAction.subscribe(value => {
        setIsVisible(true)
        setActionValue(value)
        setUri(getMonacoModelUri(value.content, repo, value.action))
      }),
    ]
    return () => observables.forEach(o => o.dispose())
  }, [customActionService.onExecuteAction, repo])

  const getActionResult = async () => {
    setIsExecuting(true)
    setError('')
    try {
      switch (actionValue.action.Name) {
        case 'Load':
          return await repo.load({ idOrPath: actionValue.content.Id, oDataOptions: { select: 'all' } })
        case 'LoadCollection':
          return await repo.loadCollection({ path: actionValue.content.Path })
        case 'Create': {
          const parsedBody = JSON.parse(postBody) as { contentType: string; content: object }
          return await repo.post({
            contentType: parsedBody.contentType,
            parentPath: actionValue.content.IsFolder
              ? actionValue.content.Path
              : PathHelper.getParentPath(actionValue.content.Path),
            content: parsedBody.content,
          })
        }
        case 'Remove': {
          const { isPermanent } = JSON.parse(postBody)
          return await repo.delete({
            idOrPath: actionValue.content.Id,
            permanent: isPermanent == null ? false : isPermanent,
          })
        }
        case 'Update':
          return await repo.patch({ idOrPath: actionValue.content.Id, content: JSON.parse(postBody).content })
        default:
          return await repo.executeAction({
            idOrPath: actionValue.content.Id,
            body: JSON.parse(postBody),
            method: actionValue.method,
            name: actionValue.action.Name,
          })
      }
    } catch (e) {
      setError(e.message)
      logger.error({
        message: `There was an error executing custom action '${actionValue.action.DisplayName ||
          actionValue.action.Name}'`,
        data: {
          isDismissed: true,
          relatedRepository: repo.configuration.repositoryUrl,
          relatedContent: actionValue.content,
          details: { actionValue, error },
        },
      })
    } finally {
      setIsExecuting(false)
    }
  }

  const onClick = async () => {
    const result = await getActionResult()

    result &&
      customActionService.onActionExecuted.setValue({
        action: actionValue.action,
        content: actionValue.content,
        response: result,
      })

    result &&
      logger.information({
        message: `Action executed: '${actionValue.action.DisplayName || actionValue.action.Name}'`,
        data: {
          relatedContent: actionValue.content,
          relatedRepository: repo.configuration.repositoryUrl,
          details: { actionValue, result },
        },
      })
    setPostBody(EDITOR_INITIAL_VALUE)
    setIsVisible(!result)
  }

  const onClose = () => {
    setPostBody(EDITOR_INITIAL_VALUE)
    setIsVisible(false)
  }

  return (
    <Dialog open={isVisible} onClose={onClose} fullWidth={true}>
      <DialogTitle>
        {localization.title
          .replace('{0}', (actionValue && (actionValue.action.DisplayName || actionValue.action.Name)) || '')
          .replace('{1}', (actionValue && (actionValue.content.DisplayName || actionValue.content.Name)) || '')}
      </DialogTitle>
      <DialogContent>
        {isExecuting ? (
          <div style={{ height: 750 }}>
            <Typography>{localization.executingAction}</Typography>
            <LinearProgress />
          </div>
        ) : (
          <>
            {actionValue &&
            actionValue.metadata &&
            actionValue.metadata.parameters &&
            actionValue.metadata.parameters.length ? (
              <MonacoEditor
                height={750}
                theme={theme.palette.type === 'dark' ? 'vs-dark' : 'vs-light'}
                width="100%"
                language="json"
                value={postBody}
                onChange={v => setPostBody(v)}
                options={{
                  automaticLayout: true,
                  lineNumbers: 'off',
                }}
                editorDidMount={(editor, monaco) => {
                  if (!uri) {
                    return
                  }
                  if (!monaco.editor.getModel(uri)) {
                    const m = monaco.editor.createModel(postBody, 'json', uri)
                    editor.setModel(m)
                  } else {
                    editor.setModel(monaco.editor.getModel(uri))
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
        <Button onClick={onClose}>{localization.cancelButton}</Button>
        <Button
          autoFocus={
            !(
              actionValue &&
              actionValue.metadata &&
              actionValue.metadata.parameters &&
              actionValue.metadata.parameters.length > 0
            )
          }
          onClick={onClick}>
          {localization.executeButton}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
