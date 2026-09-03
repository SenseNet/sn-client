import { ReactClientFieldSetting, ReferenceGrid as SnReferenceGrid } from '@sensenet/controls-react'
import { clsx } from 'clsx'
import React from 'react'
import { PATHS } from '../../application-paths'
import { useGlobalStyles } from '../../globalStyles'
import { Icon } from '../Icon'

export const ReferenceGrid: React.FC<ReactClientFieldSetting> = (props) => {
  const globalClasses = useGlobalStyles()
  return (
    <SnReferenceGrid
      {...props}
      dialogProps={{ classes: { paper: clsx(globalClasses.dialog, globalClasses.pickerDialog) } }}
      renderPickerIcon={(item) => (
        <Icon item={item} style={{ width: 'auto', height: 'auto', marginTop: 1, paddingTop: 1 }} />
      )}
      pickerClasses={{ cancelButton: globalClasses.cancelButton }}
      paths={PATHS}
    />
  )
}
