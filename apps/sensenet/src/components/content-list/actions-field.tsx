import { IconButton, TableCell } from '@material-ui/core'
import React from 'react'
import MoreHoriz from '@material-ui/icons/MoreHoriz'

export const ActionsField: React.FC<{
  onOpen: (ev: React.MouseEvent<HTMLButtonElement>) => void
}> = ({ onOpen }) => {
  return (
    <TableCell
      component="div"
      style={{
        height: '57px',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
      }}>
      <IconButton onClick={onOpen}>
        <MoreHoriz />
      </IconButton>
    </TableCell>
  )
}
