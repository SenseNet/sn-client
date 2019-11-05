import IconButton from '@material-ui/core/IconButton'
import MoreHoriz from '@material-ui/icons/MoreHoriz'
import React, { useCallback, useRef, useState } from 'react'
import { ContentContextMenu } from './context-menu/content-context-menu'

export const SecondaryActionsMenu: React.FunctionComponent<{
  style?: React.CSSProperties
}> = props => {
  const [isOpened, setIsOpened] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const onButtonClick = useCallback((ev: React.MouseEvent<HTMLElement>) => {
    ev.preventDefault()
    ev.stopPropagation()
    setIsOpened(true)
  }, [])

  const close = useCallback(() => setIsOpened(false), [])
  const open = useCallback(() => setIsOpened(true), [])
  const preventDefault = useCallback((ev: React.SyntheticEvent) => ev.preventDefault(), [])

  return (
    <div style={props.style}>
      <IconButton ref={buttonRef} onClick={onButtonClick}>
        <MoreHoriz />
      </IconButton>
      <ContentContextMenu
        isOpened={isOpened}
        onOpen={open}
        onClose={close}
        menuProps={{
          anchorEl: buttonRef.current,
          disablePortal: true,
          BackdropProps: {
            onClick: close,
            onContextMenu: preventDefault,
          },
        }}
        drawerProps={{}}
      />
    </div>
  )
}
