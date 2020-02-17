import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@material-ui/core'
import { User } from '@sensenet/default-content-types'
import { useAuthentication } from '@sensenet/hooks-react'
import React from 'react'
import { useLocalization } from '../../hooks'
import { getAuthService } from '../../services/auth-service'
import { Icon } from '../Icon'
import { useRepoState } from '../../services'
import { useDialog } from './dialog-provider'

export type LogoutDialogProps = {
  userToLogout: User
  onLoggedOut?: () => void
}

export function LogoutDialog({ userToLogout }: LogoutDialogProps) {
  const { closeLastDialog } = useDialog()
  const { logout, isLoading } = useAuthentication()
  const { repository } = useRepoState().getCurrentRepoState()!
  const localization = useLocalization().logout

  if (!repository) {
    return null
  }

  return (
    <>
      <DialogTitle>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Icon
            style={{
              margin: '0 1em 0 0',
              transition: 'filter linear 1s, opacity linear 1.5s',
            }}
            item={userToLogout}
          />
          {localization.logoutDialogTitle}
        </div>
      </DialogTitle>

      {isLoading ? (
        <DialogContent>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <CircularProgress size={64} />
            <Typography style={{ marginTop: '2em', wordBreak: 'break-word' }}>
              {localization.loggingOutFrom(repository.configuration.repositoryUrl)}
            </Typography>
          </div>
        </DialogContent>
      ) : (
        <>
          <DialogContent>
            <DialogContentText style={{ wordBreak: 'break-word' }}>
              {localization.logoutConfirmText(
                repository.configuration.repositoryUrl,
                userToLogout.DisplayName ?? userToLogout.Name,
              )}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeLastDialog}>{localization.logoutCancel}</Button>
            <Button
              onClick={async () => {
                const authService = await getAuthService(repository.configuration.repositoryUrl)
                logout(window.location.origin, authService)
                closeLastDialog()
              }}
              autoFocus={true}>
              {localization.logoutButtonTitle}
            </Button>
          </DialogActions>
        </>
      )}
    </>
  )
}

export default LogoutDialog
