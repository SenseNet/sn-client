import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import { ODataResponse } from '@sensenet/client-core'
import { Task } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import React, { ChangeEvent, Dispatch, FunctionComponent, SetStateAction, useState } from 'react'

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
  }),
)

interface NewTaskPanelProps {
  data: Task[]
  setData: Dispatch<SetStateAction<Task[]>>
}

/**
 * New task panel
 */
const NewTaskPanel: FunctionComponent<NewTaskPanelProps> = ({ data, setData }) => {
  const repo = useRepository() // Custom hook that will return with a Repository object
  const classes = useStyles()
  const [newTask, setNewTask] = useState<string>('')

  // Create new task
  const createTask = async (text: string) => {
    const result: ODataResponse<Task> = await repo.post<Task>({
      parentPath: `/Root/Content/IT/Tasks`,
      contentType: 'Task',
      oDataOptions: {
        select: ['DisplayName', 'Status', 'CreationDate'] as any,
      },
      content: {
        Name: text,
      },
    })

    const createdTask = result.d

    // put new item top of the list
    const newdata = [createdTask, ...data]

    // update data state
    setData(newdata)
  }

  const handleChange = () => (event: ChangeEvent<HTMLInputElement>) => {
    setNewTask(event.target.value)
  }

  const cleanInput = () => {
    setNewTask('')
  }

  return (
    <form
      className={classes.container}
      noValidate
      autoComplete="off"
      onSubmit={(ev) => {
        ev.preventDefault()
        createTask(newTask).then(() => cleanInput())
      }}>
      <TextField
        id="newTaskInput"
        label="New task"
        className={classes.textField}
        value={newTask}
        fullWidth
        onChange={handleChange()}
        margin="normal"
        variant="outlined"
      />
    </form>
  )
}

export default NewTaskPanel
