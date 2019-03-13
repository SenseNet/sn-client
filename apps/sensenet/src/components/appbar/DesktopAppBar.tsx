import AppBar from '@material-ui/core/AppBar'
import IconButton from '@material-ui/core/IconButton'
import Toolbar from '@material-ui/core/Toolbar'
import Menu from '@material-ui/icons/Menu'
import React, { useContext } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import logo from '../../assets/sensenet-icon-32.png'
import { ResponsiveContext, ResponsivePersonalSetttings } from '../../context/ResponsiveContextProvider'
import { ThemeContext } from '../../context/ThemeContext'
import { rootStateType } from '../../store'
import { CommandPalette } from '../command-palette/CommandPalette'
import { RepositorySelector } from '../RepositorySelector'

const mapStateToProps = (state: rootStateType) => ({
  commandPaletteOpened: state.commandPalette.isOpened,
})

const DesktopAppBar: React.StatelessComponent<
  ReturnType<typeof mapStateToProps> & { openDrawer?: () => void }
> = props => {
  const device = useContext(ResponsiveContext)
  const theme = useContext(ThemeContext)
  const personalSettings = useContext(ResponsivePersonalSetttings)

  return (
    <AppBar position="sticky" style={{ backgroundColor: theme.palette.background.paper }}>
      <Toolbar>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            textDecoration: 'none',
          }}>
          {personalSettings.drawer.type === 'temporary' ? (
            <IconButton
              // style={{ padding: 0 }}
              onClick={() => {
                props.openDrawer && props.openDrawer()
              }}>
              <Menu />
            </IconButton>
          ) : null}
          {device !== 'desktop' && props.commandPaletteOpened ? null : (
            <>
              <div
                style={{
                  marginLeft: '1em',
                  display: 'flex',
                  flexDirection: 'row',
                  textDecoration: 'none',
                  alignItems: 'center',
                }}>
                <Link to="/">
                  <img src={logo} style={{ marginRight: '1em', filter: 'drop-shadow(0px 0px 3px black)' }} />
                </Link>
              </div>
              <RepositorySelector />
            </>
          )}
        </div>

        {personalSettings.commandPalette.enabled ? <CommandPalette /> : <div style={{ flex: 1 }} />}
      </Toolbar>
    </AppBar>
  )
}

const connectedComponent = connect(mapStateToProps)(DesktopAppBar)

export { connectedComponent as DesktopAppBar }
