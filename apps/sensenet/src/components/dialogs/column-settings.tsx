import { DialogContent, IconButton, useTheme } from '@material-ui/core'
import { Close } from '@material-ui/icons'
import React, { lazy, useContext } from 'react'
import { ResponsiveContext } from '../../context'
import { useLocalization } from '../../hooks'
import { DialogTitle } from './dialog-title'
import { useDialog, useStyles } from '.'
const MonacoEditor = lazy(() => import('react-monaco-editor'))

interface ColumunSettingsProps {
  test?: any
}

export const ColumnSettings: React.FunctionComponent<ColumunSettingsProps> = () => {
  const classes = useStyles()
  const { closeLastDialog } = useDialog()
  const theme = useTheme()
  const localization = useLocalization()
  const platform = useContext(ResponsiveContext)

  return (
    <>
      <DialogTitle>
        {localization.columnSettingsDialog.title}
        <IconButton aria-label="close" className={classes.closeButton} onClick={closeLastDialog}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <MonacoEditor
          theme={theme.palette.type === 'dark' ? 'vs-dark' : 'vs-light'}
          width="100%"
          language={'json'}
          value={JSON.stringify({ test: 'ok' }, undefined, 2)}
          options={{
            automaticLayout: true,
            minimap: {
              enabled: platform === 'desktop' ? true : false,
            },
          }}
        />
      </DialogContent>
    </>
  )
}

export default ColumnSettings
