import { GenericContent } from '@sensenet/default-content-types'
import React, { Component } from 'react'
import TableCell from '@material-ui/core/TableCell'

export interface DescriptionCellProps<T extends GenericContent> {
  content: T
}

export class DescriptionCell<T extends GenericContent> extends Component<DescriptionCellProps<T>> {
  public render() {
    return (
      <TableCell>
        <div dangerouslySetInnerHTML={{ __html: this.props.content.Description || '' }} />
      </TableCell>
    )
  }
}
