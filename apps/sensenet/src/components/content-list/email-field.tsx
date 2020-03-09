import { TableCell } from '@material-ui/core'
import React from 'react'
import clsx from 'clsx'
import { useGlobalStyles } from '../../globalStyles'

export const EmailField: React.FC<{ mail: string }> = ({ mail }) => {
  const globalClasses = useGlobalStyles()

  return (
    <TableCell className={clsx(globalClasses.centeredLeft, globalClasses.virtualizedCellStyle)} component="div">
      <a href={`mailto:${mail}`}>{mail}</a>
    </TableCell>
  )
}
