import React from 'react'
import { TableCell } from '@material-ui/core'

export const PhoneField: React.FC<{ phoneNo: string; virtual?: boolean }> = ({ phoneNo, virtual }) => (
  <TableCell
    component="div"
    style={
      virtual
        ? { height: '57px', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', padding: 0 }
        : {}
    }>
    <a href={`tel:${phoneNo}`}>{phoneNo}</a>
  </TableCell>
)
