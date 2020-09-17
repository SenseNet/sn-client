import { useRepository } from '@sensenet/hooks-react'
import { AppBar, createStyles, IconButton, makeStyles, Toolbar } from '@material-ui/core'
import Menu from '@material-ui/icons/Menu'
import clsx from 'clsx'
import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/sensenet-icon-32.png'
import { ResponsivePersonalSettings } from '../../context'
import { globals, useGlobalStyles } from '../../globalStyles'
import { CommandPalette } from '../command-palette/CommandPalette'
import { DesktopNavMenu } from './desktop-nav-menu'

const useStyles = makeStyles(() => {
  return createStyles({
    appBar: {
      position: 'relative',
      height: globals.common.headerHeight,
      backgroundColor: globals.common.headerBackground,
      boxShadow: 'none',
    },
    toolBar: {
      position: 'static',
      height: '100%',
      paddingLeft: '32px',
      paddingRight: 0,
    },
    logo: {
      marginRight: '40px',
      filter: 'drop-shadow(0px 0px 3px black)',
    },
    commandPaletteReplacement: {
      flex: 1,
      marginRight: '10px',
    },
  })
})

export const DesktopAppBar: React.FunctionComponent<{ openDrawer?: () => void }> = (props) => {
  const personalSettings = useContext(ResponsivePersonalSettings)
  const classes = useStyles()
  const globalClasses = useGlobalStyles()
  const repository = useRepository()

  return (
    <AppBar position="sticky" className={clsx(globalClasses.centeredHorizontal, classes.appBar)}>
      <Toolbar className={classes.toolBar}>
        <div className={globalClasses.centeredVertical}>
          <Link to="/" className={globalClasses.centeredVertical}>
            <img src={logo} className={classes.logo} alt="logo" />
          </Link>
          {personalSettings.drawer.type === 'temporary' ? (
            <IconButton
              onClick={() => {
                props.openDrawer && props.openDrawer()
              }}>
              <Menu />
            </IconButton>
          ) : null}
          <div style={{ marginRight: '2rem' }}>{repository.configuration.repositoryUrl}</div>
        </div>

        {personalSettings.commandPalette.enabled ? (
          <CommandPalette />
        ) : (
          <div className={classes.commandPaletteReplacement} />
        )}
        <DesktopNavMenu />
      </Toolbar>
    </AppBar>
  )
}
