import TableCell from '@material-ui/core/TableCell'
import React from 'react'
import Moment from 'react-moment'

interface DateCellProps {
  date: string
}

export const DateCell: React.StatelessComponent<DateCellProps> = props => {
  return (
    <TableCell component="div">
      <Moment fromNow={true}>{props.date}</Moment>
    </TableCell>
  )
}
