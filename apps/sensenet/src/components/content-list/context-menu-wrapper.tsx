import React from 'react'
import { virtualStyle } from '.'

export const ContextMenuWrapper: React.FC<{ onContextMenu: (ev: React.MouseEvent) => void }> = props => {
  return (
    <div style={virtualStyle} onContextMenu={ev => props.onContextMenu(ev)}>
      {props.children}
    </div>
  )
}
