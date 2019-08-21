import React from 'react'
import { TableCell } from '@material-ui/core'
import Check from '@material-ui/icons/Check'
import Close from '@material-ui/icons/Close'

export const BooleanField: React.FC<{ value?: boolean }> = ({ value }) => {
  if (value === true) {
    return (
      <TableCell>
        <Check color="secondary" />
      </TableCell>
    )
  } else if (value === false) {
    return (
      <TableCell>
        <Close color="error" />
      </TableCell>
    )
  }
  return null
}
