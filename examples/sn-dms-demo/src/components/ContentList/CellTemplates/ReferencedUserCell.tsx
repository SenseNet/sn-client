import { GenericContent } from '@sensenet/default-content-types'
import TableCell from '@material-ui/core/TableCell'
import React from 'react'

export interface ReferencedUserCellProps {
  content: GenericContent
  fieldName: string
}

export interface ReferencedUserCellState {
  status: boolean
}

export class ReferencedUserCell extends React.Component<ReferencedUserCellProps, ReferencedUserCellState> {
  public render() {
    const { content, fieldName } = this.props
    const userName = ((content as any)[fieldName] as any).Name as string
    return <TableCell>{userName}</TableCell>
  }
}
