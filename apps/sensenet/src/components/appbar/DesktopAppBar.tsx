import AppBar from '@material-ui/core/AppBar'
import IconButton from '@material-ui/core/IconButton'
import Toolbar from '@material-ui/core/Toolbar'
import Menu from '@material-ui/icons/Menu'
import React, { useContext } from 'react'
import { ResponsiveContext, ResponsivePersonalSetttings } from '../../context'
import { useCommandPalette, useTheme } from '../../hooks'
import { CommandPalette } from '../command-palette/CommandPalette'
import { RepositorySelector } from '../RepositorySelector'
import { DesktopNavMenu } from './DesktopNavMenu'

export const DesktopAppBar: React.FunctionComponent<{ openDrawer?: () => void }> = props => {
  const device = useContext(ResponsiveContext)
  const theme = useTheme()
  const personalSettings = useContext(ResponsivePersonalSetttings)

  const commandPalette = useCommandPalette()

  return (
    <AppBar position="sticky" style={{ backgroundColor: theme.palette.background.paper, position: 'relative' }}>
      <Toolbar>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            textDecoration: 'none',
            overflow: 'hidden',
            alignItems: 'center',
            flexGrow: commandPalette.isOpened ? 0 : 1,
          }}>
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

        {personalSettings.commandPalette.enabled ? <CommandPalette {...commandPalette} /> : <div style={{ flex: 1 }} />}
        <DesktopNavMenu />
      </Toolbar>
    </AppBar>
  )
}
