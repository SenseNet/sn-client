import React from 'react'
import { TableCell } from '@material-ui/core'
import clsx from 'clsx'
import { useGlobalStyles } from '../../globalStyles'

export const PhoneField: React.FC<{ phoneNo: string }> = ({ phoneNo }) => {
  const globalClasses = useGlobalStyles()
  return (
    <TableCell component="div" className={clsx(globalClasses.centered, globalClasses.virtualizedCellStyle)}>
      <a href={`tel:${phoneNo}`}>{phoneNo}</a>
    </TableCell>
  )
}
