import { IconButton, TableCell } from '@material-ui/core'
import React from 'react'
import MoreHoriz from '@material-ui/icons/MoreHoriz'
import { virtualStyle } from './virtualizedStyleForFields'

export const ActionsField: React.FC<{
  onOpen: (ev: React.MouseEvent<HTMLButtonElement>) => void
}> = ({ onOpen }) => {
  return (
    <TableCell component="div" style={virtualStyle}>
      <IconButton onClick={onOpen}>
        <MoreHoriz />
      </IconButton>
    </TableCell>
  )
}
