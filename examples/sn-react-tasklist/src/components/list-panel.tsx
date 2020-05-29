// start of material imports
import { Status, Task } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import Checkbox from '@material-ui/core/Checkbox'
import IconButton from '@material-ui/core/IconButton'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import DeleteIcon from '@material-ui/icons/Delete'
import React from 'react'
// end of material imports

// start of sensenet imports

// end of sensenet imports

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
    },
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    listItemSecondaryAction: {
      visibility: 'hidden',
    },
    listItem: {
      '&:hover $listItemSecondaryAction': {
        visibility: 'inherit',
      },
    },
  }),
)

interface TodoItems {
  data: Task[]
  setData: React.Dispatch<React.SetStateAction<Task[]>>
}

/**
 * Task list panel
 */
const ListPanel: React.FunctionComponent<TodoItems> = ({ data, setData }) => {
  const repo = useRepository() // Custom hook that will return with a Repository object
  const classes = useStyles()

  const toggleTask = async (task: Task) => {
    const currentIndex = data.indexOf(task)
    const newdata = [...data]
    const newStatus = task.Status && task.Status[0] === Status.completed ? [Status.active] : [Status.completed]

    // toggle current task status
    await repo.patch<Task>({
      idOrPath: task.Path,
      content: {
        Status: newStatus,
      },
    })
    newdata[currentIndex].Status = newStatus

    // rearrange task order
    newdata.sort((a, b) => {
      const aStatus = a.Status === undefined ? Status.active : a.Status
      const bStatus = b.Status === undefined ? Status.active : b.Status
      if (aStatus === bStatus) {
        const aDate = a.CreationDate === undefined ? new Date() : new Date(a.CreationDate)
        const bDate = b.CreationDate === undefined ? new Date() : new Date(b.CreationDate)
        return aDate === bDate ? 0 : aDate < bDate ? 1 : -1
      } else {
        return aStatus > bStatus ? 1 : bStatus > aStatus ? -1 : 0
      }
    })

    // update data state
    setData(newdata)
  }

  // Remove current task
  const deleteTask = async (task: Task) => {
    const newdata = [...data.filter((x) => x.Id !== task.Id)]
    await repo.delete({
      idOrPath: task.Path,
      permanent: true,
    })
    setData(newdata)
  }

  const TodoList = data.map((d) => {
    const labelId = `checkbox-list-label-${d.Id}`
    const deleteId = `checkbox-list-deletebtn-${d.Id}`
    const classCompleted = d.Status && d.Status[0] === Status.completed ? 'comp' : ''

    return (
      <ListItem
        key={d.Id}
        role={undefined}
        dense
        button
        classes={{
          container: classes.listItem,
        }}>
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={d.Status && d.Status[0] === Status.completed}
            tabIndex={-1}
            disableRipple
            inputProps={{ 'aria-labelledby': labelId }}
            onClick={() => toggleTask(d)}
          />
        </ListItemIcon>
        <ListItemText id={labelId} primary={`${d.DisplayName}`} className={classCompleted} />
        <ListItemSecondaryAction className={classes.listItemSecondaryAction}>
          <IconButton id={deleteId} edge="end" aria-label="Delete" onClick={() => deleteTask(d)}>
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    )
  })

  return <div>{TodoList}</div>
}

export default ListPanel
