import { IconButton, TableCell } from '@material-ui/core'
import React from 'react'
import MoreHoriz from '@material-ui/icons/MoreHoriz'

export const ActionsField: React.FC<{ onOpen: (ev: React.MouseEvent<HTMLButtonElement>) => void }> = ({ onOpen }) => {
  return (
    <TableCell style={{ width: '64px' }}>
      <IconButton onClick={onOpen}>
        <MoreHoriz />
      </IconButton>
    </TableCell>
  )
}
