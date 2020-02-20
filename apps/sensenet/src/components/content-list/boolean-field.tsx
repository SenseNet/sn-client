import React from 'react'
import { TableCell } from '@material-ui/core'
import Check from '@material-ui/icons/Check'
import Close from '@material-ui/icons/Close'
import { virtualStyle } from './virtualized-style-for-fields'

export const BooleanField: React.FC<{ value?: boolean }> = ({ value }) => {
  if (value === true) {
    return (
      <TableCell style={virtualStyle}>
        <Check color="secondary" />
      </TableCell>
    )
  } else if (value === false) {
    return (
      <TableCell
        style={{
          height: '57px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          padding: 0,
        }}>
        <Close color="error" />
      </TableCell>
    )
  }
  return null
}
