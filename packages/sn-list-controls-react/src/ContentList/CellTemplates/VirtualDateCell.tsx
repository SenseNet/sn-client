import TableCell from '@material-ui/core/TableCell'
import React from 'react'
import Moment from 'react-moment'

interface VirtualDateCellProps {
  date: string
}

export const VirtualDateCell: React.StatelessComponent<VirtualDateCellProps> = props => {
  return (
    <TableCell>
      <Moment fromNow={true}>{props.date}</Moment>
    </TableCell>
  )
}
