import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Typography from '@material-ui/core/Typography'
import { useEffect, useState } from 'react'
import React from 'react'
import MonacoEditor from 'react-monaco-editor'
import { useInjector, useLocalization, useTheme } from '../../hooks'
import { CustomActionCommandProvider } from '../../services/CommandProviders/CustomActionCommandProvider'
import { createCustomActionModel } from '../../services/MonacoModels/create-custom-action-model'
import { getMonacoModelUri } from '../edit/TextEditor'

const postBodyCache = new Map<string, string>()

export const ExecuteActionDialog: React.FunctionComponent = () => {
  const theme = useTheme()

  const localization = useLocalization().customActions.executeCustomActionDialog
  const customActionService = useInjector().getInstance(CustomActionCommandProvider)

  const [actionValue, setActionValue] = useState(customActionService.onExecuteAction.getValue())

  const [isVisible, setIsVisible] = useState(false)
  const [postBody, setPostBody] = useState('{}')

  const [uri, setUri] = useState<import('monaco-editor').Uri>()

  useEffect(() => {
    uri && postBodyCache.set(uri.toString(), postBody)
  }, [postBody])

  useEffect(() => {
    const stored = uri && postBodyCache.get(uri.toString())
    if (stored) {
      setPostBody(stored)
    }
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
        setUri(getMonacoModelUri(value.content, value.action))
      }),
    ]
    return () => observables.forEach(o => o.dispose())
  }, [])

  return (
    <Dialog open={isVisible} onClose={() => setIsVisible(false)} fullWidth={true}>
      <DialogTitle>
        {localization.title
          .replace('{0}', (actionValue && (actionValue.action.DisplayName || actionValue.action.Name)) || '')
          .replace('{1}', (actionValue && (actionValue.content.DisplayName || actionValue.content.Name)) || '')}
      </DialogTitle>
      <DialogContent>
        {actionValue &&
        actionValue.metadata &&
        actionValue.metadata.parameters &&
        actionValue.metadata.parameters.length ? (
          <MonacoEditor
            height={750}
            theme={theme.palette.type === 'dark' ? 'vs-dark' : 'vs-light'}
            width="100%"
            language={'json'}
            value={postBody}
            onChange={v => setPostBody(v)}
            options={{
              automaticLayout: true,
              lineNumbers: 'off',
            }}
            editorDidMount={(editor, monaco) => {
              setTimeout(() => editor.focus())
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
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsVisible(false)}>{localization.cancelButton}</Button>
        <Button
          autoFocus={
            !(
              actionValue &&
              actionValue.metadata &&
              actionValue.metadata.parameters &&
              actionValue.metadata.parameters.length > 0
            )
          }
          onClick={() => {
            setIsVisible(false)
          }}>
          {localization.executeButton}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
