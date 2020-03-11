import { GenericContent } from '@sensenet/default-content-types'
import { IconButton, TableCell } from '@material-ui/core'
import React, { useRef, useState } from 'react'
import clsx from 'clsx'
import { MoreHoriz } from '@material-ui/icons'
import { ResponsivePlatforms } from '../../context'
import { ContentContextMenu } from '../context-menu/content-context-menu'
import { useGlobalStyles } from '../../globalStyles'

type DisplayNameProps = {
  content: GenericContent
  device: ResponsivePlatforms
  isActive: boolean
}

export const DisplayNameComponent: React.FunctionComponent<DisplayNameProps> = ({ content, device, isActive }) => {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [isOpened, setIsOpened] = useState(false)
  const globalClasses = useGlobalStyles()

  const onButtonClick = (ev: React.MouseEvent<HTMLElement>) => {
    ev.preventDefault()
    ev.stopPropagation()
    setIsOpened(true)
  }

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
        {device === 'mobile' && isActive ? (
          <div style={{ float: 'right' }}>
            <IconButton ref={buttonRef} onClick={onButtonClick}>
              <MoreHoriz />
            </IconButton>
            <ContentContextMenu
              isOpened={isOpened}
              content={content}
              onClose={() => setIsOpened(false)}
              menuProps={{
                anchorEl: buttonRef.current,
                disablePortal: true,
                BackdropProps: {
                  onClick: () => setIsOpened(false),
                  onContextMenu: ev => ev.preventDefault(),
                },
              }}
            />
          </div>
        ) : null}
      </div>
    </TableCell>
  )
}
