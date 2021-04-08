import { GenericContent } from '@sensenet/default-content-types'
import TableCell from '@material-ui/core/TableCell'
import React, { Component } from 'react'

export interface DefaultCellProps {
  content: GenericContent | null
  fieldName: string
}

export interface DefaultCellState {
  status: boolean
}

export class DefaultCell extends Component<DefaultCellProps, DefaultCellState> {
  public render() {
    return (
      <TableCell>{this.props.content ? ((this.props.content as any)[this.props.fieldName] as string) : ''}</TableCell>
    )
  }
}
