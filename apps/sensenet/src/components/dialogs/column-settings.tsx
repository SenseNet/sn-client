import { DialogContent, IconButton } from '@material-ui/core'
import { Close } from '@material-ui/icons'
import { GenericContent } from '@sensenet/default-content-types'
import React from 'react'
import { useLocalization } from '../../hooks'
import { JsonEditor } from '../editor/json-editor'
import { DialogTitle } from './dialog-title'
import { useDialog, useStyles } from '.'

interface ColumunSettingsProps<T extends GenericContent = GenericContent> {
  columnSettings: Extract<keyof T, string>
  setColumnSettings: (columnSettings: Extract<keyof T, string>) => void | Promise<void>
}

const editorContent: any = {
  Type: 'ColumnSettings',
  Name: `ColumnSettings`,
}

export const ColumnSettings = (props: ColumunSettingsProps) => {
  const { setColumnSettings, columnSettings } = props
  const dialogClasses = useStyles()
  const { closeLastDialog } = useDialog()
  const localization = useLocalization()

  return (
    <>
      <DialogTitle>
        {localization.columnSettingsDialog.title}
        <IconButton aria-label="close" className={dialogClasses.closeButton} onClick={closeLastDialog}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent style={{ height: '500px' }}>
        <JsonEditor
          content={editorContent}
          loadContent={async () => JSON.stringify(columnSettings, undefined, 3)}
          saveContent={setColumnSettings}
          handleCancel={closeLastDialog}
          showBreadCrumb={false}
        />
      </DialogContent>
    </>
  )
}

export default ColumnSettings
