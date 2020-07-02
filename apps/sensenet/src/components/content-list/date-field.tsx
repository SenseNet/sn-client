import { TableCell } from '@material-ui/core'
import clsx from 'clsx'
import moment from 'moment'
import React from 'react'
import { useGlobalStyles } from '../../globalStyles'

export const DateField: React.FC<{ date: string | Date }> = ({ date }) => {
  const globalClasses = useGlobalStyles()

  return (
    <TableCell
      component={'div' as any}
      className={clsx(globalClasses.centeredLeft, globalClasses.virtualizedCellStyle)}>
      <>{moment(date).fromNow()}</>
    </TableCell>
  )
}
