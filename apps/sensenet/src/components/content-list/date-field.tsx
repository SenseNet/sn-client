import { TableCell } from '@material-ui/core'
import React from 'react'
import moment from 'moment'
import clsx from 'clsx'
import { useGlobalStyles } from '../../globalStyles'

export const DateField: React.FC<{ date: string | Date }> = ({ date }) => {
  const globalClasses = useGlobalStyles()

  return (
    <TableCell component="div" className={clsx(globalClasses.centeredLeft, globalClasses.virtualizedCellStyle)}>
      <>{moment(date).fromNow()}</>
    </TableCell>
  )
}
