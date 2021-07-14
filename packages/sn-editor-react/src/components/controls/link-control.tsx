import {
  Button,
  Checkbox,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  IconButtonProps,
  makeStyles,
  TextField,
  Tooltip,
} from '@material-ui/core'
import { Link } from '@material-ui/icons'
import { Editor } from '@tiptap/react'
import React, { FC, useRef, useState } from 'react'
import { useLocalization } from '../../hooks'

const useStyles = makeStyles(() => {
  return createStyles({
    inNewTab: {
      marginTop: '1rem',
    },
  })
})

interface LinkControlProps {
  editor: Editor
  buttonProps?: Partial<IconButtonProps>
}

export const LinkControl: FC<LinkControlProps> = ({ editor, buttonProps }) => {
  const [open, setOpen] = useState(false)
  const [link, setLink] = useState('')
  const [inNewTab, setInNewTab] = useState(false)
  const classes = useStyles()
  const localization = useLocalization()
  const form = useRef<HTMLFormElement>(null)

  const handleClickOpen = () => {
    if (editor.state.selection.empty) {
      return false
    }
    setOpen(true)

    const currentLink = editor.getAttributes('link')
    if (currentLink?.href) {
      setLink(currentLink.href)
      setInNewTab(currentLink.target === '_blank')
    }
  }

  const handleClose = () => {
    setOpen(false)
  }

  const addLink = () => {
    if (link) {
      editor
        .chain()
        .focus()
        .setLink({ href: link, target: inNewTab ? '_blank' : 'self' })
        .run()
    }
  }

  return (
    <>
      <Tooltip title={localization.menubar.link}>
        <IconButton onClick={handleClickOpen} color={editor.isActive('link') ? 'primary' : 'default'} {...buttonProps}>
          <Link />
        </IconButton>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="link-control-title"
        fullWidth
        maxWidth="sm"
        onExited={() => {
          setLink('')
          setInNewTab(false)
        }}>
        <DialogTitle id="link-control-title">{localization.linkControl.title}</DialogTitle>
        <DialogContent>
          <form ref={form}>
            <TextField
              autoFocus
              margin="dense"
              label={localization.linkControl.url}
              type="url"
              required
              fullWidth
              value={link}
              onChange={(ev) => setLink(ev.target.value)}
            />

            <FormControlLabel
              control={
                <Checkbox checked={inNewTab} onChange={(event) => setInNewTab(event.target.checked)} color="primary" />
              }
              label={localization.linkControl.openInNewTab}
              className={classes.inNewTab}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{localization.common.cancel}</Button>
          <Button
            onClick={() => {
              if (form.current?.reportValidity()) {
                handleClose()
                addLink()
              }
            }}
            color="primary">
            {localization.linkControl.submit}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
