import AppBar from '@material-ui/core/AppBar'
import IconButton from '@material-ui/core/IconButton'
import Toolbar from '@material-ui/core/Toolbar'
import Menu from '@material-ui/icons/Menu'
import React, { useContext } from 'react'
import { createStyles, makeStyles } from '@material-ui/core'
import clsx from 'clsx'
import { ResponsiveContext, ResponsivePersonalSetttings } from '../../context'
import { useCommandPalette } from '../../hooks'
import { CommandPalette } from '../command-palette/CommandPalette'
import { RepositorySelector } from '../RepositorySelector'
import { globals, useGlobalStyles } from '../../globalStyles'
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
    repositorySelectorWrapper: {
      flexDirection: 'row',
      textDecoration: 'none',
      overflow: 'hidden',
      flexGrow: 1,
    },
    flexGrow0: {
      flexGrow: 0,
    },
    commandPaletteReplacement: {
      flex: 1,
      marginRight: '10px',
    },
  })
})

export const DesktopAppBar: React.FunctionComponent<{ openDrawer?: () => void }> = (props) => {
  const device = useContext(ResponsiveContext)
  const personalSettings = useContext(ResponsivePersonalSetttings)
  const commandPalette = useCommandPalette()
  const classes = useStyles()
  const globalClasses = useGlobalStyles()

  return (
    <AppBar position="sticky" className={clsx(globalClasses.centeredHorizontal, classes.appBar)}>
      <Toolbar className={classes.toolBar}>
        <div
          className={clsx(globalClasses.centeredVertical, classes.repositorySelectorWrapper, {
            [classes.flexGrow0]: commandPalette.isOpened,
          })}>
          {personalSettings.drawer.type === 'temporary' ? (
            <IconButton
              onClick={() => {
                props.openDrawer && props.openDrawer()
              }}>
              <Menu />
            </IconButton>
          ) : null}
          {device !== 'desktop' && commandPalette.isOpened ? null : <RepositorySelector />}
        </div>

        {personalSettings.commandPalette.enabled ? (
          <CommandPalette {...commandPalette} />
        ) : (
          <div className={classes.commandPaletteReplacement} />
        )}
        <DesktopNavMenu />
      </Toolbar>
    </AppBar>
  )
}
