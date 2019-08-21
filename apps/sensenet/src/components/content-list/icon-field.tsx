import React from 'react'
import { TableCell } from '@material-ui/core'
import { GenericContent } from '@sensenet/default-content-types'
import { Icon } from '../Icon'

export const IconField: React.FC<{ content: GenericContent }> = props => {
  return (
    <TableCell>
      <Icon item={props.content} />
    </TableCell>
  )
}
