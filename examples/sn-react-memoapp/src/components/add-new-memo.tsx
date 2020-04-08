import React, { useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Grid } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import Fab from '@material-ui/core/Fab'
import Paper from '@material-ui/core/Paper'
import SaveIcon from '@material-ui/icons/Save'
import ClearIcon from '@material-ui/icons/Clear'
import TextField from '@material-ui/core/TextField'
import { AddNewprops } from '../interfaces'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttonDefault: {
      margin: theme.spacing(1),
    },
    fab: {
      margin: theme.spacing(1),
    },
    paper: {
      padding: '30px',
      marginBottom: '10px',
    },
  }),
)

export const AddNew: React.FunctionComponent<AddNewprops> = (props) => {
  const classes = useStyles()
  const [displayname, setDisplayname] = useState('')
  const [description, setDescritption] = useState('')

  const create = () => {
    if (displayname && description) {
      props.onCreate({ DisplayName: displayname, Description: description })
      setDisplayname('')
      setDescritption('')
    }
  }

  return (
    <Paper className={classes.paper} style={{ display: props.show ? 'block' : 'none' }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h5" component="h3">
            Add new memo to list
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            style={{ width: '100%' }}
            required
            multiline={true}
            label="Memo title"
            value={displayname}
            onChange={(ev) => setDisplayname(ev.target.value)}
            rows={1}
            rowsMax={10}
            id={'DisplayName'}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            style={{ width: '100%' }}
            required
            multiline={true}
            label="Memo content"
            value={description}
            onChange={(ev) => setDescritption(ev.target.value)}
            rows={1}
            rowsMax={10}
            id={'Description'}
          />
        </Grid>
        <Grid item xs={12} style={{ textAlign: 'right' }}>
          <Fab
            aria-label="Create"
            size={'small'}
            style={{ display: displayname && description ? 'inline-flex' : 'none' }}
            onClick={create}
            className={classes.fab}>
            <SaveIcon />
          </Fab>
          <Fab aria-label="Cancel" size={'small'} onClick={props.onClose} className={classes.fab}>
            <ClearIcon />
          </Fab>
        </Grid>
      </Grid>
    </Paper>
  )
}
