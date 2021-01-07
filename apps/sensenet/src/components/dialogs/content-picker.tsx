import { ConstantContent } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import { GenericContentWithIsParent, Picker } from '@sensenet/pickers-react'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import LinearProgress from '@material-ui/core/LinearProgress'
import React, { useMemo } from 'react'
import { useGlobalStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'
import { Icon } from '../Icon'
import { DialogTitle, useDialog } from '.'

export interface ContentPickerDialogProps {
  currentPath: string
  selectionRoot?: string
  content: GenericContent
  handleSubmit?: (path: string) => void
}

export const ContentPickerDialog: React.FunctionComponent<ContentPickerDialogProps> = (props) => {
  const repository = useRepository()
  const { closeLastDialog } = useDialog()

  const localization = useLocalization().contentPickerDialog
  const globalClasses = useGlobalStyles()

  const selectionRoots = useMemo(
    () => (props.selectionRoot ? [props.selectionRoot] : [ConstantContent.PORTAL_ROOT.Path]),
    [props.selectionRoot],
  )
  const itemsODataOptions = useMemo(() => ({ filter: '' }), [])

  const handleSubmit = async (selection: GenericContentWithIsParent[]) => {
    props.handleSubmit?.(selection[0].Path)
    closeLastDialog()
  }

  return (
    <>
      <DialogTitle>
        <div className={globalClasses.centeredVertical}>
          <Icon item={props.content} style={{ marginRight: '1em' }} />
          {localization.title}
        </div>
      </DialogTitle>

      <Picker
        repository={repository}
        currentPath={props.currentPath}
        selectionRoots={selectionRoots}
        itemsODataOptions={itemsODataOptions}
        renderIcon={(item) => <Icon item={item} />}
        renderLoading={() => <LinearProgress />}
        pickerContainer={DialogContent}
        actionsContainer={DialogActions}
        handleCancel={closeLastDialog}
        handleSubmit={handleSubmit}
        localization={{ cancelButton: localization.cancelButton, submitButton: localization.selectButton }}
        required={1}
      />
    </>
  )
}

export default ContentPickerDialog
