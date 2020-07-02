import { TableCell } from '@material-ui/core'
import clsx from 'clsx'
import React from 'react'
import { useGlobalStyles } from '../../globalStyles'

export const EmailField: React.FC<{ mail: string }> = ({ mail }) => {
  const globalClasses = useGlobalStyles()

  return (
    <TableCell
      className={clsx(globalClasses.centeredLeft, globalClasses.virtualizedCellStyle)}
      component={'div' as any}>
      <a href={`mailto:${mail}`}>{mail}</a>
    </TableCell>
  )
}
