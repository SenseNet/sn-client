import { TableCell } from '@material-ui/core'
import React from 'react'

export const DescriptionField: React.FC<{ text: string }> = ({ text }) => (
  <TableCell>
    <div style={{ maxWidth: '300px' }}>{text ? text.replace(/<(.|\n)*?>/g, '') : ''}</div>
  </TableCell>
)
