import { TableCell } from '@material-ui/core'
import React from 'react'
import moment from 'moment'
import { virtualStyle } from './virtualized-style-for-fields'

export const DateField: React.FC<{ date: string | Date }> = ({ date }) => (
  <TableCell style={virtualStyle}>
    <div>{moment(date).fromNow()}</div>
  </TableCell>
)
