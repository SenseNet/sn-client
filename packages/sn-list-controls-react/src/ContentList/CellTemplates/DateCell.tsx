import { TableCell } from '@material-ui/core'
import type { Locale } from 'date-fns'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import React from 'react'

interface DateCellProps {
  date: string
  virtual?: boolean
  locale?: Locale
}

export const DateCell: React.FunctionComponent<DateCellProps> = (props) => {
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
      {props.date && formatDistanceToNow(new Date(props.date), { locale: props.locale, addSuffix: true })}
    </TableCell>
  )
}
