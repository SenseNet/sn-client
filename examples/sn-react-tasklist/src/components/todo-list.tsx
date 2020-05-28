import { ODataCollectionResponse } from '@sensenet/client-core'
import { Task } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import Grid from '@material-ui/core/Grid'
import List from '@material-ui/core/List'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

// start of material imports
import React, { useEffect, useState } from 'react'
// end of material imports

// start of sensenet imports
// end of sensenet imports

// start of component imports
import ListPanel from './list-panel'
import NewTaskPanel from './new-task'
// end of component imports

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

/**
 * Todo List
 */
const TodoListPanel = () => {
  const repo = useRepository() // Custom hook that will return with a Repository object
  const classes = useStyles()
  const [data, setData] = useState<Task[]>([])

  useEffect(() => {
    /**
     * load from repo
     */
    async function loadContents() {
      const result: ODataCollectionResponse<Task> = await repo.loadCollection({
        path: `/Root/Content/IT/Tasks`,
        oDataOptions: {
          select: ['DisplayName', 'Description', 'CreationDate', 'CreatedBy', 'Status'] as any,
          orderby: ['Status', ['CreationDate', 'desc']],
          expand: ['CreatedBy'] as any,
        },
      })

      setData(result.d.results)
    }
    loadContents()
  }, [repo])

  return (
    <Grid container justify="center" alignItems="center">
      <Grid item xs={12} md={4}>
        <List className={classes.root}>
          <NewTaskPanel data={data} setData={setData} />
          <ListPanel data={data} setData={setData} />
        </List>
      </Grid>
    </Grid>
  )
}

export default TodoListPanel
