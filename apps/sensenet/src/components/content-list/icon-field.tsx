import { GenericContent } from '@sensenet/default-content-types'
import React from 'react'
import { TableCell } from '@material-ui/core'
import clsx from 'clsx'
import { Icon } from '../Icon'
import { useGlobalStyles } from '../../globalStyles'

export const IconField: React.FC<{ content: GenericContent }> = (props) => {
  const globalClasses = useGlobalStyles()

  return (
    <TableCell className={clsx(globalClasses.centeredLeft, globalClasses.virtualizedCellStyle)} component="div">
      <Icon item={props.content} />
    </TableCell>
  )
}
