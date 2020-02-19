import React from 'react'
import { TableCell } from '@material-ui/core'
import { virtualStyle } from './virtualizedStyleForFields'

export const PhoneField: React.FC<{ phoneNo: string }> = ({ phoneNo }) => (
  <TableCell component="div" style={virtualStyle}>
    <a href={`tel:${phoneNo}`}>{phoneNo}</a>
  </TableCell>
)
