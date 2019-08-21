import { TableCell } from '@material-ui/core'
import React from 'react'
import moment from 'moment'

export const DateField: React.FC<{ date: string | Date }> = ({ date }) => (
  <TableCell>
    <div>{moment(date).fromNow()}</div>
  </TableCell>
)
