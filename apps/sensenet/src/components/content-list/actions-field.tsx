import { IconButton, TableCell } from '@material-ui/core'
import MoreHoriz from '@material-ui/icons/MoreHoriz'
import clsx from 'clsx'
import React from 'react'
import { useGlobalStyles } from '../../globalStyles'

export const ActionsField: React.FC<{
  onOpen: (ev: React.MouseEvent<HTMLButtonElement>) => void
}> = ({ onOpen }) => {
  const globalClasses = useGlobalStyles()
  return (
    <TableCell component="div" className={clsx(globalClasses.centered, globalClasses.virtualizedCellStyle)}>
      <IconButton onClick={onOpen}>
        <MoreHoriz />
      </IconButton>
    </TableCell>
  )
}
