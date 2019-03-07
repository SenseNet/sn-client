import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import PowerSettingsNew from '@material-ui/icons/PowerSettingsNew'
import { LoginState, Repository } from '@sensenet/client-core'
import React, { useContext, useState } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { ContentContextProvider } from '../services/ContentContextProvider'
import { rootStateType } from '../store'
import { logoutFromRepository } from '../store/Session'
import { Icon } from './Icon'
import { InjectorContext } from './InjectorContext'
import { ThemeContext } from './ThemeContext'

const mapStateToProps = (state: rootStateType) => ({
  loginState: state.session.loginState,
  currentUser: state.session.currentUser,
})

const mapDispatchToProps = {
  logoutFromRepository,
}

export const LogoutButtonComponent: React.FunctionComponent<
  ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps
> = props => {
  if (props.loginState !== LoginState.Authenticated) {
    return null
  }
  const theme = useContext(ThemeContext)
  const injector = useContext(InjectorContext)
  const repo = injector.GetInstance(Repository)
  const ctx = injector.GetInstance(ContentContextProvider)
  const [showLogout, setShowLogout] = useState(false)

  return (
    <div>
      <Tooltip placement="bottom-end" title="Log out">
        <IconButton onClick={() => setShowLogout(true)}>
          <PowerSettingsNew style={{ color: theme.palette.text.primary }} />
        </IconButton>
      </Tooltip>
      <Dialog open={showLogout} onClose={() => setShowLogout(false)}>
        <DialogTitle>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Icon style={{ margin: '0 1em 0 0' }} item={props.currentUser} /> Really log out?
          </div>
        </DialogTitle>
        <DialogContent>
          <DialogContentText style={{ wordBreak: 'break-word' }}>
            You are logged in to{' '}
            <Link to="/" onClick={() => setShowLogout(false)}>
              {repo.configuration.repositoryUrl}
            </Link>{' '}
            as{' '}
            <Link to={ctx.getPrimaryActionUrl(props.currentUser)} onClick={() => setShowLogout(false)}>
              {props.currentUser.DisplayName || props.currentUser.Name}
            </Link>
            . <br />
            Are you sure that you want to leave?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowLogout(false)}>Cancel</Button>
          <Button onClick={() => props.logoutFromRepository()} autoFocus={true}>
            Log out
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

const connectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(LogoutButtonComponent)
export { connectedComponent as LogoutButton }
