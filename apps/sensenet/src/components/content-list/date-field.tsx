import { TableCell, Tooltip } from '@material-ui/core'
import clsx from 'clsx'
import React from 'react'
import { useGlobalStyles } from '../../globalStyles'
import { usePersonalSettings } from '../../hooks'
import { useDateUtils } from '../../hooks/use-date-utils'

export const DateField: React.FC<{ date: string | Date }> = ({ date }) => {
  const globalClasses = useGlobalStyles()
  const dateUtils = useDateUtils()
  const personalSettings = usePersonalSettings()

  return (
    <TableCell component="div" className={clsx(globalClasses.centeredLeft, globalClasses.virtualizedCellStyle)}>
      <Tooltip
        title={dateUtils.formatDate(
          new Date(date),
          'yyyy-MM-dd HH:mm aaa',
          personalSettings.language === 'hungarian' ? 'hu' : 'enUS',
        )}
        placement="top">
        <div>{dateUtils.formatDistanceFromNow(new Date(date))}</div>
      </Tooltip>
    </TableCell>
  )
}
