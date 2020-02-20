import { TableCell } from '@material-ui/core'
import React from 'react'
import { virtualStyle } from './virtualized-style-for-fields'

export const DescriptionField: React.FC<{ text: string }> = ({ text }) => (
  <TableCell component="div" style={{ ...virtualStyle, justifyContent: 'left' }}>
    <div style={{ maxWidth: '300px' }}>{text ? text.replace(/<(.|\n)*?>/g, '') : ''}</div>
  </TableCell>
)
