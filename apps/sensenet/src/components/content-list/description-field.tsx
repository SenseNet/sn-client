import { TableCell } from '@material-ui/core'
import React from 'react'
import clsx from 'clsx'
import { useGlobalStyles } from '../../globalStyles'

export const DescriptionField: React.FC<{ text: string }> = ({ text }) => {
  const globalClasses = useGlobalStyles()

  return (
    <TableCell
      component="div"
      className={clsx(globalClasses.centered, globalClasses.virtualizedCellStyle)}
      style={{ justifyContent: 'left' }}>
      <div style={{ maxWidth: '300px' }}>{text ? text.replace(/<(.|\n)*?>/g, '') : ''}</div>
    </TableCell>
  )
}
