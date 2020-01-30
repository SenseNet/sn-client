import TableCell from '@material-ui/core/TableCell'
import { GenericContent } from '@sensenet/default-content-types'
import React from 'react'

export interface VirtualDefaultCellProps<T extends GenericContent> {
  cellData: T
}

export const VirtualDefaultCell = <T extends GenericContent>(props: VirtualDefaultCellProps<T>) => (
  <TableCell>{props.cellData.toString()}</TableCell>
)
