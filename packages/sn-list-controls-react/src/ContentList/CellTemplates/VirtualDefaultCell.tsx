import { GenericContent } from '@sensenet/default-content-types'
import { TableCell, Tooltip, useTheme } from '@material-ui/core'
import React, { MouseEventHandler } from 'react'

export interface VirtualDefaultCellProps<T extends GenericContent> {
  cellData: T
  onTextClick?: MouseEventHandler<HTMLDivElement>
  textForLink?: string
}

export const VirtualDefaultCell = <T extends GenericContent>(props: VirtualDefaultCellProps<T>) => {
  const theme = useTheme()

  return (
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
        <div
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            color: props.onTextClick ? theme.palette.primary.main : 'inherit',
          }}
          onClick={props.onTextClick}>
          {props.cellData?.toString()}
          {props.textForLink}
        </div>
      </Tooltip>
    </TableCell>
  )
}
