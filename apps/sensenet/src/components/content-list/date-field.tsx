import { TableCell, Tooltip } from '@material-ui/core'
import clsx from 'clsx'
import React, { FC } from 'react'
import { useGlobalStyles } from '../../globalStyles'
import { useDateUtils } from '../../hooks/use-date-utils'

export const DateField: FC<{ date: string | Date }> = ({ date }) => {
  const globalClasses = useGlobalStyles()
  const dateUtils = useDateUtils()

  return (
    <TableCell component="div" className={clsx(globalClasses.centeredLeft, globalClasses.virtualizedCellStyle)}>
      <Tooltip title={dateUtils.formatDate(new Date(date), 'yyyy-MM-dd HH:mm aaa')} placement="top">
        <div>{dateUtils.formatDistanceFromNow(new Date(date))}</div>
      </Tooltip>
    </TableCell>
  )
}
