import { GenericContent } from '@sensenet/default-content-types'
import TableCell from '@material-ui/core/TableCell'
import Tooltip from '@material-ui/core/Tooltip'
import React from 'react'

export interface VirtualDefaultCellProps<T extends GenericContent> {
  cellData: T
}

export const VirtualDefaultCell = <T extends GenericContent>(props: VirtualDefaultCellProps<T>) => (
  <TableCell
    style={{
      height: '57px',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'left',
      padding: 0,
      paddingRight: 20,
    }}
    component="div">
    <Tooltip title={props.cellData?.toString() ?? ''} placement="top">
      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {props.cellData?.toString()}
      </div>
    </Tooltip>
  </TableCell>
)
