import { AppBar, createStyles, IconButton, makeStyles, Theme, Toolbar } from '@material-ui/core'
import Menu from '@material-ui/icons/Menu'
import { useRepository } from '@sensenet/hooks-react'
import { clsx } from 'clsx'
import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import logo from '../../../../../../sn-client/examples/sn-dms-demo/src/assets/sensenet_white.png'
import { ResponsivePersonalSettings } from '../../context'
import { globals, useGlobalStyles } from '../../globalStyles'
import { CommandPalette } from '../command-palette/CommandPalette'
import { DesktopNavMenu } from './desktop-nav-menu'

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    appBar: {
      position: 'relative',
      height: globals.common.headerHeight,
      backgroundColor:
        theme.palette.type === 'dark' ? globals.common.headerBackground : globals.common.headerLightBackground,
      boxShadow: 'none',
    },
    toolBar: {
      position: 'static',
      height: '100%',
      minHeight: '42px',
      paddingLeft: '16px',
      paddingRight: 0,
    },
    logo: {
      marginRight: '32px',
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
            <img src={logo} className={classes.logo} alt="logo" data-test="sensenet-logo" width="29" height="32" />
          </Link>
          {personalSettings.drawer.type === 'temporary' ? (
            <IconButton
              onClick={() => {
                props.openDrawer && props.openDrawer()
              }}>
              <Menu />
            </IconButton>
          ) : null}
          <div style={{ marginRight: '2rem' }} data-test="sensenet-header">
            {repository.configuration.repositoryUrl}
          </div>
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
