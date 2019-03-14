import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import PowerSettingsNew from '@material-ui/icons/PowerSettingsNew'
import { FormsAuthenticationService, LoginState } from '@sensenet/client-core'
import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { ContentRoutingContext } from '../context/ContentRoutingContext'
import { RepositoryContext } from '../context/RepositoryContext'
import { SessionContext } from '../context/SessionContext'
import { ThemeContext } from '../context/ThemeContext'
import { Icon } from './Icon'

export const LogoutButton: React.FunctionComponent<{
  buttonStyle?: React.CSSProperties
  onLoggedOut?: () => void
}> = props => {
  const session = useContext(SessionContext)
  const theme = useContext(ThemeContext)
  const repo = useContext(RepositoryContext)
  const ctx = useContext(ContentRoutingContext)
  const [showLogout, setShowLogout] = useState(false)

  const [isLoggingOut, setIsLoggingOut] = useState(false)

  if (session.debouncedState !== LoginState.Authenticated) {
    return null
  }

  return (
    <div>
      <Tooltip placement="bottom-end" title="Log out">
        <IconButton
          onClick={() => {
            setShowLogout(true)
          }}>
          <PowerSettingsNew style={{ ...props.buttonStyle, color: theme.palette.text.primary }} />
        </IconButton>
      </Tooltip>
      <Dialog open={showLogout} onClose={() => setShowLogout(false)}>
        <DialogTitle>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Icon style={{ margin: '0 1em 0 0' }} item={session.currentUser} /> Really log out?
          </div>
        </DialogTitle>
        <DialogContent>
          {isLoggingOut ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
              <CircularProgress size={64} />
              <Typography style={{ marginTop: '2em', wordBreak: 'break-word' }}>
                Logging out from {repo.configuration.repositoryUrl}...
              </Typography>
            </div>
          ) : (
            <DialogContentText style={{ wordBreak: 'break-word' }}>
              ) : (
              <>
                You are logged in to{' '}
                <Link to="/" onClick={() => setShowLogout(false)}>
                  {repo.configuration.repositoryUrl}
                </Link>{' '}
                as{' '}
                <Link to={ctx.getPrimaryActionUrl(session.currentUser)} onClick={() => setShowLogout(false)}>
                  {session.currentUser.DisplayName || session.currentUser.Name}
                </Link>
                . <br />
                Are you sure that you want to leave?
              </>
            </DialogContentText>
          )}
        </DialogContent>
        {isLoggingOut ? null : (
          <DialogActions>
            <Button onClick={() => setShowLogout(false)}>Cancel</Button>
            <Button
              onClick={async () => {
                try {
                  setIsLoggingOut(true)
                  await repo.authentication.logout().then(() => {
                    props.onLoggedOut && props.onLoggedOut()
                  })
                } catch {
                  /** ignore logout response parsing error */
                } finally {
                  /** */
                  ;(repo.authentication as FormsAuthenticationService).getCurrentUser()
                }
                setTimeout(() => {
                  setShowLogout(false)
                  setIsLoggingOut(false)
                }, 3000)
              }}
              autoFocus={true}>
              Log out
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </div>
  )
}
