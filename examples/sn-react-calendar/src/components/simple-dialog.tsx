import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import Button from '@material-ui/core/Button'

export interface DialogProps {
  open: boolean
  title: string
  onClose: (value: boolean) => void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttonDefault: {
      margin: theme.spacing(1),
    },
  }),
)

export const DialogComponent: React.FunctionComponent<DialogProps> = props => {
  const classes = useStyles()

  return (
    <Dialog open={props.open} maxWidth="sm" aria-labelledby="simple-dialog-title">
      <DialogTitle id="simple-dialog-title">Are you sure you want to delete it?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{props.title}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.onClose(true)} color="secondary" className={classes.buttonDefault}>
          Yes
        </Button>
        <Button onClick={() => props.onClose(false)} color="default" className={classes.buttonDefault}>
          No
        </Button>
      </DialogActions>
    </Dialog>
  )
}
