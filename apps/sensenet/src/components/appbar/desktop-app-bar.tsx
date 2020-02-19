import { AppBar, IconButton, Toolbar, Typography } from '@material-ui/core'
import Menu from '@material-ui/icons/Menu'
import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/sensenet-icon-32.png'
import { ResponsivePersonalSetttings } from '../../context'
import { useCommandPalette, useRepoUrlFromLocalStorage } from '../../hooks'
import { CommandPalette } from '../command-palette/CommandPalette'
import { DesktopNavMenu } from './desktop-nav-menu'

export const DesktopAppBar: React.FunctionComponent<{ openDrawer?: () => void }> = props => {
  const { repoUrl } = useRepoUrlFromLocalStorage()
  const personalSettings = useContext(ResponsivePersonalSetttings)
  const commandPalette = useCommandPalette()

  return (
    <AppBar position="sticky" color="inherit">
      <Toolbar style={{ position: 'static' }}>
        {personalSettings.drawer.type === 'temporary' ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              textDecoration: 'none',
              overflow: 'hidden',
              alignItems: 'center',
              flexGrow: commandPalette.isOpened ? 0 : 1,
            }}>
            <IconButton
              onClick={() => {
                props.openDrawer?.()
              }}>
              <Menu />
            </IconButton>
          </div>
        ) : null}
        <Typography variant="h5">
          <Link to="/" style={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <img src={logo} style={{ marginRight: '.5em', filter: 'drop-shadow(0px 1    px 1px black)' }} alt="logo" />
            <p>{repoUrl}</p>
          </Link>
        </Typography>

        {personalSettings.commandPalette.enabled ? <CommandPalette {...commandPalette} /> : <div style={{ flex: 1 }} />}
        <DesktopNavMenu />
      </Toolbar>
    </AppBar>
  )
}
