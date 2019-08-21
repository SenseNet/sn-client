import { TableCell } from '@material-ui/core'
import React from 'react'
import { GenericContent } from '@sensenet/default-content-types'
import { Icon } from '../Icon'

export const ReferenceField: React.FC<{ content: GenericContent }> = ({ content }) => {
  return (
    <TableCell padding={'none'}>
      {content.Name !== 'Somebody' ? (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Icon item={content} />
          <div style={{ marginLeft: '1em' }}>{content.DisplayName || content.Name}</div>
        </div>
      ) : null}
    </TableCell>
  )
}
