import IconButton from '@material-ui/core/IconButton'
import MoreHoriz from '@material-ui/icons/MoreHoriz'
import React, { useState } from 'react'
import { ContentContextMenu } from './ContentContextMenu'

export const SecondaryActionsMenu: React.FunctionComponent<{
  style?: React.CSSProperties
}> = props => {
  const [isOpened, setIsOpened] = useState(false)
  const [ref, setRef] = useState<HTMLElement | null>(null)

  return (
    <div style={props.style}>
      <IconButton
        ref={r => setRef(r)}
        onClick={ev => {
          ev.preventDefault()
          ev.stopPropagation()
          setRef(ev.currentTarget)
          setIsOpened(true)
        }}>
        <MoreHoriz />
      </IconButton>
      <ContentContextMenu
        isOpened={isOpened}
        onOpen={() => setIsOpened(true)}
        onClose={() => setIsOpened(false)}
        menuProps={{
          anchorEl: ref,
          disablePortal: true,
          BackdropProps: {
            onClick: () => setIsOpened(false),
            onContextMenu: ev => ev.preventDefault(),
          },
        }}
        drawerProps={{}}
      />
    </div>
  )
}
