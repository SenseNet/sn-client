import { TableCell } from '@material-ui/core'
import { GenericContent } from '@sensenet/default-content-types'
import React, { Component } from 'react'

export interface ReferenceCellProps<T extends GenericContent> {
  content: T
  fieldName: keyof T
  virtual?: boolean
}

export class ReferenceCell<T extends GenericContent> extends Component<ReferenceCellProps<T>, {}> {
  public render() {
    const { content, fieldName, virtual } = this.props
    return (
      <TableCell
        style={
          virtual
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
        component={virtual ? 'div' : 'td'}>
        <span>{content[fieldName]}</span>
      </TableCell>
    )
  }
}
