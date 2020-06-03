import { GenericContent } from '@sensenet/default-content-types'
import { TableCell } from '@material-ui/core'
import clsx from 'clsx'
import React from 'react'
import { useGlobalStyles } from '../../globalStyles'
import { Icon } from '../Icon'

export const ReferenceField: React.FC<{ content: GenericContent }> = ({ content }) => {
  const globalClasses = useGlobalStyles()
  return (
    <TableCell component="div" className={clsx(globalClasses.centeredLeft, globalClasses.virtualizedCellStyle)}>
      {content.Name !== 'Somebody' ? (
        <div className={globalClasses.centeredVertical}>
          <Icon item={content} />
          <div style={{ marginLeft: '1em' }}>{content.DisplayName || content.Name}</div>
        </div>
      ) : null}
    </TableCell>
  )
}
