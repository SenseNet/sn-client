import { AppBar, createStyles, makeStyles, Toolbar } from '@material-ui/core'
import React from 'react'
import { HamburgerMenu, HamburgerMenuClassKey } from './hamburger-menu'
import { ThreeDotMenu, ThreeDotMenuClassKey } from './three-dot-menu'

export const HEADER_HEIGHT = '64px'

const useStyles = makeStyles(() => {
  return createStyles({
    appBar: {
      height: HEADER_HEIGHT,
      backgroundColor: '#342cac',
      boxShadow: 'none',
    },
    toolBar: {
      display: 'flex',
      justifyContent: 'space-between',
      height: '100%',
      paddingRight: 0,
      paddingLeft: '20px',
    },
    hamburgerAndTitleContainer: {
      display: 'flex',
      alignItems: 'center',
    },
  })
})

type UniversalHeaderClassKey = Partial<ReturnType<typeof useStyles>>

interface UniversalHeaderProps {
  title: string
  renderThreeDotMenuItems?: React.ReactNode
  classes?: UniversalHeaderClassKey
  hamburgerMenuClasses?: HamburgerMenuClassKey
  threeDotMenuClasses?: ThreeDotMenuClassKey
}

export const UniversalHeader: React.FunctionComponent<UniversalHeaderProps> = (props) => {
  const classes = useStyles(props)

  return (
    <AppBar position="sticky" className={classes.appBar}>
      <Toolbar className={classes.toolBar}>
        <div className={classes.hamburgerAndTitleContainer}>
          <HamburgerMenu classes={props.hamburgerMenuClasses} />
          <div>{props.title}</div>
        </div>
        {props.renderThreeDotMenuItems && (
          <ThreeDotMenu classes={props.threeDotMenuClasses} menuItems={props.renderThreeDotMenuItems} />
        )}
      </Toolbar>
    </AppBar>
  )
}
