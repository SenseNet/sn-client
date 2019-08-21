import React from 'react'
import { TableCell } from '@material-ui/core'

export const PhoneField: React.FC<{ phoneNo: string }> = ({ phoneNo }) => (
  <TableCell>
    <a href={`tel:${phoneNo}`}>{phoneNo}</a>
  </TableCell>
)
