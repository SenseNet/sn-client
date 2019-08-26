import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import React, { useEffect, useState } from 'react'
import MonacoEditor from 'react-monaco-editor'
import { useInjector } from '@sensenet/hooks-react'
import { useLocalization, useTheme } from '../../hooks'
import { CustomActionCommandProvider } from '../../services/CommandProviders/CustomActionCommandProvider'

export const CustomActionResultDialog: React.FunctionComponent = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [isReadOnly, setReadOnly] = useState(false)
  const localization = useLocalization().customActions.resultsDialog
  const theme = useTheme()

  const [response, setResponse] = useState('{}')

  const customActionsService = useInjector().getInstance(CustomActionCommandProvider)

  useEffect(() => {
    const observer = customActionsService.onActionExecuted.subscribe(value => {
      setIsVisible(true)
      setReadOnly(false)
      setResponse(
        JSON.stringify(
          {
            content: {
              Id: value.content.Id,
              Path: value.content.Path,
              Name: value.content.Name,
            },
            action: value.action.Name,
            response: value.response,
          },
          undefined,
          3,
        ),
      )
      setReadOnly(true)
    })
    return () => observer.dispose()
  }, [customActionsService.onActionExecuted])

  return (
    <Dialog open={isVisible} onClose={() => setIsVisible(false)} fullWidth={true}>
      <DialogTitle>{localization.title}</DialogTitle>
      <DialogContent>
        <MonacoEditor
          height={750}
          theme={theme.palette.type === 'dark' ? 'vs-dark' : 'vs-light'}
          width="100%"
          language="json"
          value={response}
          options={{
            minimap: { enabled: false },
            automaticLayout: true,
            lineNumbers: 'off',
            readOnly: isReadOnly,
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsVisible(false)}>{localization.closeButton}</Button>
      </DialogActions>
    </Dialog>
  )
}
