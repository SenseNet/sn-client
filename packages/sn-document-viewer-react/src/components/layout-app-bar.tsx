import { AppBar, createStyles, makeStyles, Toolbar } from '@material-ui/core'
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
      color: 'inherit',
      backgroundColor: 'inherit',
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
