import { ReactClientFieldSetting, ReferenceGrid as SnReferenceGrid } from '@sensenet/controls-react'
import { clsx } from 'clsx'
import React from 'react'
import { useGlobalStyles } from '../../globalStyles'
import { DialogTitle } from '../dialogs/dialog-title'
import { Icon } from '../Icon'

export const ReferenceGrid: React.FC<ReactClientFieldSetting> = (props) => {
  const globalClasses = useGlobalStyles()
  return (
    <SnReferenceGrid
      {...props}
      dialogProps={{ classes: { paper: clsx(globalClasses.dialog, globalClasses.pickerDialog) } }}
      dialogTitleComponent={DialogTitle}
      renderPickerIcon={(item) => <Icon item={item} />}
      pickerClasses={{ cancelButton: globalClasses.cancelButton }}
    />
  )
}
