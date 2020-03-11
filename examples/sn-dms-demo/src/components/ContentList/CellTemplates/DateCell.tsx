import TableCell from '@material-ui/core/TableCell'
import { GenericContent } from '@sensenet/default-content-types'
import React from 'react'
import moment from 'moment'

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
