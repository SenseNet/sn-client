import { TableCell } from '@material-ui/core'
import React from 'react'
import { virtualStyle } from './virtualizedStyleForFields'

export const DescriptionField: React.FC<{ text: string }> = ({ text }) => (
  <TableCell component="div" style={{ ...virtualStyle, justifyContent: 'left' }}>
    <div style={{ maxWidth: '300px' }}>{text ? text.replace(/<(.|\n)*?>/g, '') : ''}</div>
  </TableCell>
)
