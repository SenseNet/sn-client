import React from 'react'
import { TableCell } from '@material-ui/core'
import { GenericContent } from '@sensenet/default-content-types'
import { Icon } from '../Icon'
import { virtualStyle } from './virtualized-style-for-fields'

export const IconField: React.FC<{ content: GenericContent }> = props => {
  return (
    <TableCell style={virtualStyle} component="div">
      <Icon item={props.content} />
    </TableCell>
  )
}
