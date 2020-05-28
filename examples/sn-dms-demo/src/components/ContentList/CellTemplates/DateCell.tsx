import { GenericContent } from '@sensenet/default-content-types'
import TableCell from '@material-ui/core/TableCell'
import moment from 'moment'
import React from 'react'

export interface DateCellProps {
  content: GenericContent
  fieldName: string
}

export class DateCell extends React.Component<DateCellProps, {}> {
  public render() {
    const { content, fieldName } = this.props
    const formattedDate = moment((content as any)[fieldName] as any).fromNow()
    return <TableCell>{formattedDate}</TableCell>
  }
}
