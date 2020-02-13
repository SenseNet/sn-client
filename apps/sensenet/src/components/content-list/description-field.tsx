import { TableCell } from '@material-ui/core'
import React from 'react'

export const DescriptionField: React.FC<{ text: string }> = ({ text }) => (
  <TableCell
    component="div"
    style={{
      height: '57px',
      display: 'flex',
      justifyContent: 'left',
      alignItems: 'center',
      width: '100%',
      padding: 0,
    }}>
    <div style={{ maxWidth: '300px' }}>{text ? text.replace(/<(.|\n)*?>/g, '') : ''}</div>
  </TableCell>
)
