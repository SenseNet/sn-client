import React from 'react'
import MonacoEditor from 'react-monaco-editor'
import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { useGlobalStyles } from '../../globalStyles'
import { useLocalization, useTheme } from '../../hooks'
import { useDialog } from './dialog-provider'

export type CustomActionResultDialogProps = {
  response: string
}

export function CustomActionResultDialog({ response = '{}' }: CustomActionResultDialogProps) {
  const localization = useLocalization().customActions.resultsDialog
  const { closeLastDialog } = useDialog()
  const theme = useTheme()
  const globalClasses = useGlobalStyles()

  return (
    <>
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
            readOnly: true,
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button className={globalClasses.cancelButton} onClick={closeLastDialog}>
          {localization.closeButton}
        </Button>
      </DialogActions>
    </>
  )
}

export default CustomActionResultDialog
