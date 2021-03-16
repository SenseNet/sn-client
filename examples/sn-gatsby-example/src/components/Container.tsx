import { createStyles, makeStyles } from '@material-ui/core'
import * as React from 'react'

const useStyles = makeStyles(() => {
  return createStyles({
    container: {
      position: 'relative',
      marginLeft: 'auto',
      marginRight: 'auto',
      width: 'auto',
      maxWidth: '60rem',
    },
  })
})

const Container: React.FC = (props) => {
  const classes = useStyles()
  return <div className={classes.container}>{props.children}</div>
}

export default Container
