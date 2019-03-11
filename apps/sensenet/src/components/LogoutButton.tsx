import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import PowerSettingsNew from '@material-ui/icons/PowerSettingsNew'
import { FormsAuthenticationService, LoginState } from '@sensenet/client-core'
import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { InjectorContext } from '../context/InjectorContext'
import { RepositoryContext } from '../context/RepositoryContext'
import { SessionContext } from '../context/SessionContext'
import { ThemeContext } from '../context/ThemeContext'
import { ContentContextProvider } from '../services/ContentContextProvider'
import { Icon } from './Icon'

export const LogoutButton: React.FunctionComponent = () => {
  const session = useContext(SessionContext)
  const theme = useContext(ThemeContext)
  const injector = useContext(InjectorContext)
  const repo = useContext(RepositoryContext)
  const ctx = injector.GetInstance(ContentContextProvider)
  const [showLogout, setShowLogout] = useState(false)

  if (session.state !== LoginState.Authenticated) {
    return null
  }

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
            <Icon style={{ margin: '0 1em 0 0' }} item={session.currentUser} /> Really log out?
          </div>
        </DialogTitle>
        <DialogContent>
          <DialogContentText style={{ wordBreak: 'break-word' }}>
            You are logged in to{' '}
            <Link to="/" onClick={() => setShowLogout(false)}>
              {repo.configuration.repositoryUrl}
            </Link>{' '}
            as{' '}
            <Link to={ctx.getPrimaryActionUrl(session.currentUser, repo)} onClick={() => setShowLogout(false)}>
              {session.currentUser.DisplayName || session.currentUser.Name}
            </Link>
            . <br />
            Are you sure that you want to leave?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowLogout(false)}>Cancel</Button>
          <Button
            onClick={async () => {
              try {
                await repo.authentication.logout()
              } catch {
                /** ignore logout response parsing error */
              } finally {
                /** */
                ;(repo.authentication as FormsAuthenticationService).getCurrentUser()
              }
            }}
            autoFocus={true}>
            Log out
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
