import { createStyles, makeStyles } from '@material-ui/core'
import * as React from 'react'

const useStyles = makeStyles(() => {
  return createStyles({
    layoutRoot: {
      display: 'flex',
      minHeight: '100vh',
      flexDirection: 'column',
    },
  })
})

const LayoutRoot: React.FC = (props) => {
  const classes = useStyles()

  return (
    <>
      <div className={classes.layoutRoot}>{props.children}</div>
    </>
  )
}

export default LayoutRoot
