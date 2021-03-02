import { TableCell } from '@material-ui/core'
import Tooltip from '@material-ui/core/Tooltip'
import clsx from 'clsx'
import moment from 'moment'
import React from 'react'
import { useGlobalStyles } from '../../globalStyles'

export const DateField: React.FC<{ date: string | Date }> = ({ date }) => {
  const globalClasses = useGlobalStyles()

  return (
    <TableCell component="div" className={clsx(globalClasses.centeredLeft, globalClasses.virtualizedCellStyle)}>
      <Tooltip title={moment(new Date(date)).format('YYYY-MM-DD HH:mm a')} placement="top">
        <div>{moment(date).fromNow()}</div>
      </Tooltip>
    </TableCell>
  )
}
