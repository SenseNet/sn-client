import { GenericContent } from '@sensenet/default-content-types'
import TableCell from '@material-ui/core/TableCell'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import React from 'react'

export interface DateCellProps {
  content: GenericContent
  fieldName: string
}

export class DateCell extends React.Component<DateCellProps, {}> {
  public render() {
    const { content, fieldName } = this.props
    const date = (content as any)[fieldName] as any
    return <TableCell>{date && formatDistanceToNow(new Date(date), { addSuffix: true })}</TableCell>
  }
}
