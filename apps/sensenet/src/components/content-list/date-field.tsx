import { TableCell } from '@material-ui/core'
import clsx from 'clsx'
import React from 'react'
import { useGlobalStyles } from '../../globalStyles'
import { useDateUtils } from '../../hooks/use-date-utils'

export const DateField: React.FC<{ date: string | Date }> = ({ date }) => {
  const globalClasses = useGlobalStyles()
  const dateUtils = useDateUtils()

  return (
    <TableCell component="div" className={clsx(globalClasses.centeredLeft, globalClasses.virtualizedCellStyle)}>
      <>{dateUtils.formatDistanceFromNow(new Date(date))}</>
    </TableCell>
  )
}
