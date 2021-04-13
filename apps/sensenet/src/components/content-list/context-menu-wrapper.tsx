import clsx from 'clsx'
import React, { FC, MouseEvent } from 'react'
import { useGlobalStyles } from '../../globalStyles'

export const ContextMenuWrapper: FC<{ onContextMenu: (ev: MouseEvent) => void }> = (props) => {
  const globalClasses = useGlobalStyles()
  return (
    <div
      className={clsx(globalClasses.centeredLeft, globalClasses.virtualizedCellStyle)}
      onContextMenu={(ev) => props.onContextMenu(ev)}>
      {props.children}
    </div>
  )
}
