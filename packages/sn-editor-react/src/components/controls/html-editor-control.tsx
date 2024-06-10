import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  IconButtonProps,
  Tooltip,
} from '@material-ui/core'
import CodeIcon from '@material-ui/icons/Code'
import { Editor } from '@tiptap/react'
import React, { FC, useState } from 'react'
import { useLocalization } from '../../hooks'
import { HtmlEditor } from '../html-editor'

interface HTMLEditorControlProps {
  editor: Editor
  buttonProps?: Partial<IconButtonProps>
}

export const HTMLEditorControl: FC<HTMLEditorControlProps> = ({ editor, buttonProps }) => {
  const [open, setOpen] = useState(false)
  const [html, setHtml] = useState(editor.getHTML())
  const localization = useLocalization()

  const handleClickOpen = () => {
    setOpen(true)
  }

  const saveHTMLContent = () => {
    editor.chain().focus().setContent(html, true).run()
    setOpen(false)
  }

  const handleClose = () => {
    if (editor.getHTML() === html) {
      setOpen(false)
      return
    }

    const confirmResult = window.confirm(localization.HTMLEditorControl.confirm)
    if (!confirmResult) {
      return
    }
    saveHTMLContent()
  }

  return (
    <>
      <Tooltip title={`${localization.menubar.EditHtml}`}>
        <IconButton
          onClick={() => handleClickOpen()}
          color={editor.isActive('code') ? 'primary' : 'default'}
          {...buttonProps}>
          <CodeIcon style={{ marginTop: '-7px' }} />
          <span style={{ position: 'absolute', fontSize: '12px', top: '13px', fontWeight: 'bold' }}>html</span>
        </IconButton>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="html-editor-control-title"
        fullWidth
        maxWidth="lg"
        onExited={() => {}}>
        <DialogTitle id="html-editor-control-title">{localization.HTMLEditorControl.title}</DialogTitle>
        <DialogContent>
          <HtmlEditor initialState={editor.getHTML()} fieldOnChange={setHtml} />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false)
            }}>
            {localization.common.cancel}
          </Button>
          <Button
            onClick={() => {
              saveHTMLContent()
            }}
            color="primary">
            {localization.linkControl.submit}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
