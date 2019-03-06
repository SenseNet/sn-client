import AppBar from '@material-ui/core/AppBar'
import IconButton from '@material-ui/core/IconButton'
import Toolbar from '@material-ui/core/Toolbar'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import PowerSettingsNew from '@material-ui/icons/PowerSettingsNew'
import { LoginState } from '@sensenet/client-core'
import React, { useContext } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import logo from '../../assets/sensenet-icon-32.png'
import { rootStateType } from '../../store'
import { logoutFromRepository } from '../../store/Session'
import { CommandPalette } from '../command-palette/CommandPalette'
import { ResponsivePersonalSetttings } from '../ResponsiveContextProvider'
import { ThemeContext } from '../ThemeContext'
import { UserAvatar } from '../UserAvatar'

const mapStateToProps = (state: rootStateType) => ({
  repositoryUrl: state.persistedState.lastRepositoryUrl,
  user: state.session.currentUser,
  loginState: state.session.loginState,
})

const mapDispatchToProps = {
  logoutFromRepository,
}

const DesktopAppBar: React.StatelessComponent<
  ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps
> = props => {
  const theme = useContext(ThemeContext)
  const personalSettings = useContext(ResponsivePersonalSetttings)

  return (
    <AppBar position="sticky" style={{ backgroundColor: theme.palette.background.paper }}>
      <Toolbar>
        <a href="#" style={{ display: 'flex', flexDirection: 'row', textDecoration: 'none' }}>
          <img src={logo} style={{ marginRight: '1em', filter: 'drop-shadow(0px 0px 3px black)' }} />
          <Typography variant="h5" color="textPrimary">
            SENSENET
          </Typography>
        </a>
        {personalSettings.commandPalette.enabled ? <CommandPalette /> : <div style={{ flex: 1 }} />}

        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <Tooltip placement="bottom" title={props.user.DisplayName || props.user.Name}>
            <Link to={`/personalSettings`} style={{ textDecoration: 'none' }}>
              <UserAvatar user={props.user} repositoryUrl={props.repositoryUrl} />
            </Link>
          </Tooltip>
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
