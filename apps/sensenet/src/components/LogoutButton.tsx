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
import { ConstantContent, FormsAuthenticationService, LoginState } from '@sensenet/client-core'
import React, { useEffect, useState } from 'react'
import { useLocalization, useLogger, useRepository, useSession, useTheme } from '../hooks'
import { Icon } from './Icon'

export const LogoutButton: React.FunctionComponent<{
  buttonStyle?: React.CSSProperties
  onLoggedOut?: () => void
}> = props => {
  const session = useSession()
  const theme = useTheme()
  const repo = useRepository()
  const [showLogout, setShowLogout] = useState(false)
  const logger = useLogger('LogoutComponent')

  const [userToLogout, setUserToLogout] = useState({ ...session.currentUser })
  const localization = useLocalization().logout

  useEffect(() => {
    if (session.state === LoginState.Authenticated && session.currentUser.Id !== ConstantContent.VISITOR_USER.Id) {
      setUserToLogout(session.currentUser)
    }
  }, [session.state, session.currentUser])

  const [isLoggingOut, setIsLoggingOut] = useState(false)

  return (
    <div>
      {session.state !== LoginState.Authenticated ? null : (
        <Tooltip placement="bottom-end" title={localization.logoutButtonTitle}>
          <Button
            onClick={() => {
              setShowLogout(true)
            }}
            style={{ minWidth: 20, paddingTop: 4, paddingBottom: 4, borderRadius: 0 }}>
            <PowerSettingsNew style={{ ...props.buttonStyle, color: theme.palette.text.primary }} />
          </Button>
        </Tooltip>
      )}
      <Dialog open={showLogout} onClose={() => setShowLogout(false)}>
        <DialogTitle>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Icon
              style={{
                margin: '0 1em 0 0',
                filter: isLoggingOut ? 'contrast(0)' : undefined,
                opacity: isLoggingOut ? 0 : 1,
                transition: 'filter linear 1s, opacity linear 1.5s',
              }}
              item={userToLogout}
            />
            {localization.logoutDialogTitle}
          </div>
        </DialogTitle>
        <DialogContent>
          {isLoggingOut ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
              <CircularProgress size={64} />
              <Typography style={{ marginTop: '2em', wordBreak: 'break-word' }}>
                {localization.loggingOutFrom.replace('{0}', repo.configuration.repositoryUrl)}
              </Typography>
            </div>
          ) : (
            <DialogContentText style={{ wordBreak: 'break-word' }}>
              {localization.logoutConfirmText
                .replace('{0}', repo.configuration.repositoryUrl)
                .replace('{1}', userToLogout.DisplayName || userToLogout.Name)}
            </DialogContentText>
          )}
        </DialogContent>
        {isLoggingOut ? null : (
          <DialogActions>
            <Button onClick={() => setShowLogout(false)}>{localization.logoutCancel}</Button>
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
                setShowLogout(false)
                setIsLoggingOut(false)
                logger.information({
                  message: localization.logoutSuccessNotification.replace('{0}', repo.configuration.repositoryUrl),
                })
              }}
              autoFocus={true}>
              {localization.logoutButtonTitle}
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </div>
  )
}
