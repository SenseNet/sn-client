import { ReactClientFieldSetting, ReferenceGrid as SnReferenceGrid } from '@sensenet/controls-react'
import React from 'react'
import { useGlobalStyles } from '../../globalStyles'
import { DialogTitle } from '../dialogs/dialog-title'

export const ReferenceGrid: React.FC<ReactClientFieldSetting> = (props) => {
  const globalClasses = useGlobalStyles()
  return (
    <SnReferenceGrid
      {...props}
      dialogProps={{ classes: { paper: globalClasses.dialog } }}
      dialogTitleComponent={DialogTitle}
    />
  )
}
