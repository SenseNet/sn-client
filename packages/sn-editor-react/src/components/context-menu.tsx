import { Divider, Menu, MenuItem, useTheme } from '@material-ui/core'
import { Editor } from '@tiptap/core'
import React, { FC } from 'react'
import { useLocalization } from '../hooks'

export interface ContextMenuPosition {
  x: null | number
  y: null | number
}

interface ContextMenuProps {
  editor: Editor
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  mousePosition: ContextMenuPosition
  setMousePosition: React.Dispatch<React.SetStateAction<ContextMenuPosition>>
}

export const ContextMenu: FC<ContextMenuProps> = (props) => {
  const theme = useTheme()
  const localization = useLocalization()

  const handleClose = () => {
    props.setOpen(false)
    props.setMousePosition({ x: null, y: null })
  }

  return (
    <Menu
      open={props.open}
      anchorReference="anchorPosition"
      anchorPosition={
        props.mousePosition.y !== null && props.mousePosition.x !== null
          ? { top: props.mousePosition.y, left: props.mousePosition.x }
          : undefined
      }
      transitionDuration={{ enter: theme.transitions.duration.enteringScreen, exit: 0 }}
      BackdropProps={{
        onClick: () => {
          handleClose()
        },
        onContextMenu: (ev) => ev.preventDefault(),
      }}>
      {props.editor.can().deleteTable() && (
        <MenuItem
          onClick={() => {
            props.editor.chain().focus().deleteTable().run()
            handleClose()
          }}>
          {localization.contextMenu.deleteTable}
        </MenuItem>
      )}
      <Divider variant="middle" />
      {props.editor.can().addRowBefore() && (
        <MenuItem
          onClick={() => {
            props.editor.chain().focus().addRowBefore().run()
            handleClose()
          }}>
          {localization.contextMenu.addRowAbove}
        </MenuItem>
      )}
      {props.editor.can().addRowAfter() && (
        <MenuItem
          onClick={() => {
            props.editor.chain().focus().addRowAfter().run()
            handleClose()
          }}>
          {localization.contextMenu.addRowBelow}
        </MenuItem>
      )}
      <Divider variant="middle" />
      {props.editor.can().addColumnBefore() && (
        <MenuItem
          onClick={() => {
            props.editor.chain().focus().addColumnBefore().run()
            handleClose()
          }}>
          {localization.contextMenu.addColBefore}
        </MenuItem>
      )}
      {props.editor.can().addColumnAfter() && (
        <MenuItem
          onClick={() => {
            props.editor.chain().focus().addColumnAfter().run()
            handleClose()
          }}>
          {localization.contextMenu.addColAfter}
        </MenuItem>
      )}
      <Divider variant="middle" />
      {props.editor.can().deleteRow() && (
        <MenuItem
          onClick={() => {
            props.editor.chain().focus().deleteRow().run()
            handleClose()
          }}>
          {localization.contextMenu.deleteRow}
        </MenuItem>
      )}
      {props.editor.can().deleteColumn() && (
        <MenuItem
          onClick={() => {
            props.editor.chain().focus().deleteColumn().run()
            handleClose()
          }}>
          {localization.contextMenu.deleteCol}
        </MenuItem>
      )}
      <Divider variant="middle" />
      {props.editor.can().toggleHeaderRow() && (
        <MenuItem
          onClick={() => {
            props.editor.chain().focus().toggleHeaderRow().run()
            handleClose()
          }}>
          {localization.contextMenu.toggleHeaderRow}
        </MenuItem>
      )}
      {props.editor.can().toggleHeaderColumn() && (
        <MenuItem
          onClick={() => {
            props.editor.chain().focus().toggleHeaderColumn().run()
            handleClose()
          }}>
          {localization.contextMenu.toggleHeaderCol}
        </MenuItem>
      )}
      {(props.editor.can().mergeCells() || props.editor.can().splitCell()) && <Divider variant="middle" />}
      {props.editor.can().mergeCells() && (
        <MenuItem
          onClick={() => {
            props.editor.chain().focus().mergeCells().run()
            handleClose()
          }}>
          {localization.contextMenu.mergeCells}
        </MenuItem>
      )}
      {props.editor.can().splitCell() && (
        <MenuItem
          onClick={() => {
            props.editor.chain().focus().splitCell().run()
            handleClose()
          }}>
          {localization.contextMenu.splitCell}
        </MenuItem>
      )}
    </Menu>
  )
}
