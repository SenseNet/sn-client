import { TableCell } from '@material-ui/core'
import React from 'react'
import moment from 'moment'

export const DateField: React.FC<{ date: string | Date; virtual?: boolean }> = ({ date, virtual }) => (
  <TableCell
    style={
      virtual
        ? { height: '57px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: 0 }
        : {}
    }>
    <div>{moment(date).fromNow()}</div>
  </TableCell>
)
