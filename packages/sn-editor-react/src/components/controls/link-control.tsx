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
import React, { FC, useState } from 'react'

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

  const handleClickOpen = () => {
    if (editor.state.selection.empty) {
      return false
    }
    setOpen(true)

    const currentLink = editor.getMarkAttributes('link')
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
      <Tooltip title="Link">
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
        <DialogTitle id="link-control-title">Insert a link</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Url"
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
            label="Open link in a new tab"
            className={classes.inNewTab}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={() => {
              handleClose()
              addLink()
            }}
            color="primary">
            Insert
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
