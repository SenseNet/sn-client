import { createStyles, Fab, makeStyles, Theme } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import React, { useContext } from 'react'
import { SharedContext } from '../context/shared-context'

/**
 * Style for component with Material UI
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fabAdd: {
      position: 'fixed',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
    extendedIcon: {
      marginRight: theme.spacing(1),
    },
  }),
)

const AddNewEvent: React.FunctionComponent = () => {
  const classes = useStyles()
  const sharedcontext = useContext(SharedContext)

  return (
    <Fab
      color="secondary"
      variant="extended"
      onClick={() => {
        // New event
        sharedcontext.setOpennewmodal(true)
      }}
      aria-label="Add new"
      className={classes.fabAdd}>
      <AddIcon className={classes.extendedIcon} />
      Add new
    </Fab>
  )
}

export default AddNewEvent
