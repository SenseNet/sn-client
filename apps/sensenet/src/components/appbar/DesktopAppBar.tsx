import AppBar from '@material-ui/core/AppBar'
import IconButton from '@material-ui/core/IconButton'
import Toolbar from '@material-ui/core/Toolbar'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import Menu from '@material-ui/icons/Menu'
import PowerSettingsNew from '@material-ui/icons/PowerSettingsNew'
import { LoginState } from '@sensenet/client-core'
import React, { useContext } from 'react'
import { connect } from 'react-redux'
import logo from '../../assets/sensenet-icon-32.png'
import { rootStateType } from '../../store'
import { toggleDrawer } from '../../store/Drawer'
import { logoutFromRepository } from '../../store/Session'
import { CommandPalette } from '../command-palette/CommandPalette'
import { ResponsiveContext, ResponsivePersonalSetttings } from '../ResponsiveContextProvider'
import { ThemeContext } from '../ThemeContext'

const mapStateToProps = (state: rootStateType) => ({
  commandPaletteOpened: state.commandPalette.isOpened,
  loginState: state.session.loginState,
})

const mapDispatchToProps = {
  logoutFromRepository,
  toggleDrawer,
}

const DesktopAppBar: React.StatelessComponent<
  ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps
> = props => {
  const device = useContext(ResponsiveContext)
  const theme = useContext(ThemeContext)
  const personalSettings = useContext(ResponsivePersonalSetttings)

  return (
    <AppBar position="sticky" style={{ backgroundColor: theme.palette.background.paper }}>
      <Toolbar>
        <div style={{ display: 'flex', flexDirection: 'row', textDecoration: 'none' }}>
          {personalSettings.drawer.type === 'temporary' ? (
            <IconButton style={{ padding: 0 }} onClick={() => props.toggleDrawer()}>
              <Menu />
            </IconButton>
          ) : null}
          {device !== 'desktop' && props.commandPaletteOpened ? null : (
            <a
              href="#"
              style={{
                marginLeft: '1em',
                display: 'flex',
                flexDirection: 'row',
                textDecoration: 'none',
                alignItems: 'center',
              }}>
              <img src={logo} style={{ marginRight: '1em', filter: 'drop-shadow(0px 0px 3px black)' }} />
              <Typography variant="h5" color="textPrimary">
                SENSENET
              </Typography>
            </a>
          )}
        </div>
        {personalSettings.commandPalette.enabled ? <CommandPalette /> : <div style={{ flex: 1 }} />}

        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          {props.loginState === LoginState.Authenticated ? (
            <Tooltip placement="bottom-end" title="Log out">
              <IconButton onClick={() => props.logoutFromRepository()}>
                <PowerSettingsNew style={{ color: theme.palette.text.primary }} />
              </IconButton>
            </Tooltip>
          ) : null}
        </div>
      </Toolbar>
    </AppBar>
  )
}

const connectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DesktopAppBar)

export { connectedComponent as DesktopAppBar }
