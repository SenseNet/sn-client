import React from 'react'
import { TableCell } from '@material-ui/core'
import Check from '@material-ui/icons/Check'
import Close from '@material-ui/icons/Close'
import clsx from 'clsx'
import { useGlobalStyles } from '../../globalStyles'

export const BooleanField: React.FC<{ value?: boolean }> = ({ value }) => {
  const globalClasses = useGlobalStyles()
  if (value === true) {
    return (
      <TableCell className={clsx(globalClasses.centeredLeft, globalClasses.virtualizedCellStyle)}>
        <Check color="secondary" />
      </TableCell>
    )
  } else if (value === false) {
    return (
      <TableCell className={clsx(globalClasses.centeredLeft, globalClasses.virtualizedCellStyle)}>
        <Close color="error" />
      </TableCell>
    )
  }
  return null
}
