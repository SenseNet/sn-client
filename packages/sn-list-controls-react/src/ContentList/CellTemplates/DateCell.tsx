import TableCell from '@material-ui/core/TableCell'
import React from 'react'
import Moment from 'react-moment'

interface DateCellProps {
  date: string
  virtual?: boolean
}

export const DateCell: React.StatelessComponent<DateCellProps> = props => {
  return (
    <TableCell
      style={
        props.virtual
          ? {
              height: '57px',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
            }
          : {}
      }
      component={props.virtual ? 'div' : 'td'}>
      <Moment fromNow={true}>{props.date}</Moment>
    </TableCell>
  )
}
