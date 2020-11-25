import { TableCell } from '@material-ui/core'
import clsx from 'clsx'
import React from 'react'
import { useGlobalStyles } from '../../globalStyles'

export const PhoneField: React.FC<{ phoneNo: string }> = ({ phoneNo }) => {
  const globalClasses = useGlobalStyles()
  return (
    <TableCell
      component={'div' as any}
      className={clsx(globalClasses.centeredLeft, globalClasses.virtualizedCellStyle)}>
      <a href={`tel:${phoneNo}`}>{phoneNo}</a>
    </TableCell>
  )
}
