import { TableCell } from '@material-ui/core'
import { GenericContent } from '@sensenet/default-content-types'
import { clsx } from 'clsx'
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
      component="div"
      classes={{
        root: clsx(globalClasses.centeredLeft, globalClasses.virtualizedCellStyle),
      }}
      style={{ justifyContent: 'left' }}>
      <div
        className={globalClasses.centeredVertical}
        data-test={`table-cell-${content.DisplayName?.replace(/\s+/g, '-').toLowerCase()}`}
        style={{
          justifyContent: 'space-between',
        }}>
        {content.DisplayName || content.Name}
      </div>
    </TableCell>
  )
}
