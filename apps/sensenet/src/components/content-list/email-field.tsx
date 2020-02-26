import { TableCell } from '@material-ui/core'
import React from 'react'
import { virtualStyle } from './virtualized-style-for-fields'

export const EmailField: React.FC<{ mail: string }> = ({ mail }) => (
  <TableCell style={virtualStyle} component="div">
    <a href={`mailto:${mail}`}>{mail}</a>
  </TableCell>
)
