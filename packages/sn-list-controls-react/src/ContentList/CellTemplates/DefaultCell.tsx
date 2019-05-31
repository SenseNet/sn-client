import TableCell from '@material-ui/core/TableCell'
import { GenericContent } from '@sensenet/default-content-types'
import React from 'react'

export interface DefaultCellProps<T extends GenericContent, K extends keyof T> {
  isSelected: boolean
  content: T
  field: K
}

export const DefaultCell = <T extends GenericContent, K extends keyof T>(props: DefaultCellProps<T, K>) => (
  <TableCell className={props.isSelected ? 'selected' : ''}>
    <span>{props.content[props.field] && props.content[props.field].toString()}</span>
  </TableCell>
)
