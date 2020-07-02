import { GenericContent } from '@sensenet/default-content-types'
import { TableCell } from '@material-ui/core'
import clsx from 'clsx'
import React from 'react'
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
      component={'div' as any}
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
