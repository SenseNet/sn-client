import { IconButton, TableCell } from '@material-ui/core'
import MoreHoriz from '@material-ui/icons/MoreHoriz'
import clsx from 'clsx'
import React, { FC, MouseEvent } from 'react'
import { useGlobalStyles } from '../../globalStyles'

export const ActionsField: FC<{
  onOpen: (ev: MouseEvent<HTMLButtonElement>) => void
  name: string
}> = ({ onOpen, name }) => {
  const globalClasses = useGlobalStyles()
  return (
    <TableCell component="div" className={clsx(globalClasses.centered, globalClasses.virtualizedCellStyle)}>
      <IconButton onClick={onOpen} data-test={`actions-button-${name?.replace(/\s+/g, '-').toLowerCase()}`}>
        <MoreHoriz />
      </IconButton>
    </TableCell>
  )
}
