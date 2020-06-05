import { GenericContent } from '@sensenet/default-content-types'
import { TableCell } from '@material-ui/core'
import clsx from 'clsx'
import React from 'react'
import { useGlobalStyles } from '../../globalStyles'
import { Icon } from '../Icon'

export const IconField: React.FC<{ content: GenericContent }> = (props) => {
  const globalClasses = useGlobalStyles()

  return (
    <TableCell className={clsx(globalClasses.centeredLeft, globalClasses.virtualizedCellStyle)} component="div">
      <Icon item={props.content} />
    </TableCell>
  )
}
