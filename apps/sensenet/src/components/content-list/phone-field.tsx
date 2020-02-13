import React from 'react'
import { TableCell } from '@material-ui/core'

export const PhoneField: React.FC<{ phoneNo: string }> = ({ phoneNo }) => (
  <TableCell
    component="div"
    style={{
      height: '57px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      padding: 0,
    }}>
    <a href={`tel:${phoneNo}`}>{phoneNo}</a>
  </TableCell>
)
