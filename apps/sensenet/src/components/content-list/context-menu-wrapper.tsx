import React from 'react'
import clsx from 'clsx'
import { useGlobalStyles } from '../../globalStyles'

export const ContextMenuWrapper: React.FC<{ onContextMenu: (ev: React.MouseEvent) => void }> = (props) => {
  const globalClasses = useGlobalStyles()
  return (
    <div
      className={clsx(globalClasses.centeredLeft, globalClasses.virtualizedCellStyle)}
      onContextMenu={(ev) => props.onContextMenu(ev)}>
      {props.children}
    </div>
  )
}
