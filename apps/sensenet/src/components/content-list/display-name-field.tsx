import { GenericContent } from '@sensenet/default-content-types'
import { TableCell } from '@material-ui/core'
import React from 'react'
import clsx from 'clsx'
import { ResponsivePlatforms } from '../../context'
import { useGlobalStyles } from '../../globalStyles'

type DisplayNameProps = {
  content: GenericContent
  device: ResponsivePlatforms
  isActive: boolean
}

export const DisplayNameComponent: React.FunctionComponent<DisplayNameProps> = ({ content }) => {
  const globalClasses = useGlobalStyles()

  return (
    <TableCell
      component="div"
      className={clsx(globalClasses.centeredLeft, globalClasses.virtualizedCellStyle)}
      style={{ justifyContent: 'left' }}>
      <div
        className={globalClasses.centeredVertical}
        style={{
          justifyContent: 'space-between',
        }}>
        {content.DisplayName || content.Name}
      </div>
    </TableCell>
  )
}
