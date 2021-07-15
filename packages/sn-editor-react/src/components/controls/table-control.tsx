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
import { TableChartOutlined } from '@material-ui/icons'
import { Editor } from '@tiptap/react'
import React, { FC, useRef, useState } from 'react'
import { useLocalization } from '../../hooks'

const useStyles = makeStyles(() => {
  return createStyles({
    textField: {
      marginRight: '2rem',
    },
    checkbox: {
      marginTop: '1rem',
    },
  })
})

interface TableControlProps {
  editor: Editor
  buttonProps?: Partial<IconButtonProps>
}

export const TableControl: FC<TableControlProps> = ({ editor, buttonProps }) => {
  const [open, setOpen] = useState(false)
  const [rows, setRows] = useState<number>()
  const [cols, setCols] = useState<number>()
  const [hasHeader, setHasHeader] = useState(true)
  const classes = useStyles()
  const localization = useLocalization()
  const form = useRef<HTMLFormElement>(null)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const insertTable = () => {
    if (rows && cols) {
      editor.chain().focus().insertTable({ rows, cols, withHeaderRow: hasHeader }).run()
    }
  }

  return (
    <>
      <Tooltip title={localization.menubar.table}>
        <IconButton onClick={handleClickOpen} color={editor.isActive('link') ? 'primary' : 'default'} {...buttonProps}>
          <TableChartOutlined />
        </IconButton>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="table-control-title"
        maxWidth="sm"
        onExited={() => {
          setRows(undefined)
          setCols(undefined)
          setHasHeader(true)
        }}>
        <DialogTitle id="table-control-title">{localization.tableControl.title}</DialogTitle>
        <DialogContent>
          <form ref={form}>
            <div>
              <TextField
                autoFocus
                margin="dense"
                label={localization.tableControl.rows}
                type="number"
                required
                InputProps={{ inputProps: { min: 1 } }}
                value={rows ?? ''}
                onChange={(ev) => setRows(parseInt(ev.target.value, 10))}
                className={classes.textField}
              />

              <TextField
                margin="dense"
                label={localization.tableControl.cols}
                type="number"
                required
                InputProps={{ inputProps: { min: 1 } }}
                value={cols ?? ''}
                onChange={(ev) => setCols(parseInt(ev.target.value, 10))}
              />
            </div>

            <FormControlLabel
              control={
                <Checkbox
                  checked={hasHeader}
                  onChange={(event) => setHasHeader(event.target.checked)}
                  color="primary"
                />
              }
              label={localization.tableControl.hasHeader}
              className={classes.checkbox}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{localization.common.cancel}</Button>
          <Button
            type="button"
            onClick={() => {
              if (form.current?.reportValidity()) {
                handleClose()
                insertTable()
              }
            }}
            color="primary">
            {localization.tableControl.submit}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
