import React from 'react'
import { TableCell } from '@material-ui/core'
import { GenericContent } from '@sensenet/default-content-types'
import { Icon } from '../Icon'

export const IconField: React.FC<{ content: GenericContent; virtual?: boolean }> = props => {
  return (
    <TableCell
      style={
        props.virtual
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
      component="div">
      <Icon item={props.content} />
    </TableCell>
  )
}
