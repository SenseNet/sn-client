import { TableCell } from '@material-ui/core'
import React from 'react'

export const EmailField: React.FC<{ mail: string }> = ({ mail }) => (
  <TableCell
    style={{
      height: '57px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      padding: 0,
    }}
    component="div">
    <a href={`mailto:${mail}`}>{mail}</a>
  </TableCell>
)
