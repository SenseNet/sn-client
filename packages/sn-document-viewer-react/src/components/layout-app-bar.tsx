import AppBar from '@material-ui/core/AppBar'
import createStyles from '@material-ui/core/styles/createStyles'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Toolbar from '@material-ui/core/Toolbar'
import React from 'react'

const useStyles = makeStyles(() => {
  return createStyles({
    appBar: {
      position: 'relative',
      zIndex: 1,
    },
    toolBar: {
      display: 'flex',
      justifyContent: 'space-between',
    },
  })
})

type LayoutAppBarClassKey = Partial<ReturnType<typeof useStyles>>
/**
 * Represents a Toolbar component in an AppBar
 */
export const LayoutAppBar: React.FunctionComponent<{ classes?: LayoutAppBarClassKey }> = (props) => {
  const classes = useStyles(props)

  return (
    <AppBar position="sticky" className={classes.appBar}>
      <Toolbar className={classes.toolBar}>{props.children}</Toolbar>
    </AppBar>
  )
}
