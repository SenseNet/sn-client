import { createStyles, makeStyles } from '@material-ui/core'
import * as React from 'react'

const useStyles = makeStyles(() => {
  return createStyles({
    layoutMain: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
    },
  })
})

const LayoutMain: React.FC = (props) => {
  const classes = useStyles()
  return <main className={classes.layoutMain}>{props.children}</main>
}

export default LayoutMain
