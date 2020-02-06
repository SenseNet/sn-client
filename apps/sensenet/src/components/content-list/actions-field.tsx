import { IconButton, TableCell } from '@material-ui/core'
import React from 'react'
import MoreHoriz from '@material-ui/icons/MoreHoriz'

export const ActionsField: React.FC<{
  onOpen: (ev: React.MouseEvent<HTMLButtonElement>) => void
  virtual?: boolean
}> = ({ onOpen, virtual }) => {
  return (
    <TableCell
      component="div"
      style={
        virtual
          ? {
              height: '57px',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
            }
          : { width: '64px' }
      }>
      <IconButton onClick={onOpen}>
        <MoreHoriz />
      </IconButton>
    </TableCell>
  )
}
