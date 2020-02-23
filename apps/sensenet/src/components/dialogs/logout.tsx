import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@material-ui/core'
import { useAuthentication, useRepository } from '@sensenet/hooks-react'
import React from 'react'
import { useCurrentUser } from '../../context'
import { useLocalization } from '../../hooks'
import { getAuthService } from '../../services/auth-service'
import { Icon } from '../Icon'
import { useDialog } from './dialog-provider'

export function LogoutDialog() {
  const { closeLastDialog } = useDialog()
  const currentUser = useCurrentUser()
  const { logout, isLoading } = useAuthentication()
  const repository = useRepository()
  const localization = useLocalization().logout

  return (
    <>
      <DialogTitle>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Icon
            style={{
              margin: '0 1em 0 0',
              transition: 'filter linear 1s, opacity linear 1.5s',
            }}
            item={currentUser}
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
                currentUser?.DisplayName ?? currentUser?.Name ?? 'Visitor',
              )}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeLastDialog}>{localization.logoutCancel}</Button>
            <Button
              onClick={async () => {
                const authService = await getAuthService(repository.configuration.repositoryUrl)
                logout({ returnUrl: window.location.origin, authService })
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
