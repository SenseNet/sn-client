import React, { useState } from 'react'
import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@material-ui/core'
import { useLogger, useRepository } from '@sensenet/hooks-react'
import { User } from '@sensenet/default-content-types'
import { useLocalization } from '../../hooks'
import { Icon } from '../Icon'
import { useDialog } from './dialog-provider'

export type LogoutDialogProps = {
  userToLogout: User
  onLoggedOut?: () => void
}

export function LogoutDialog({ userToLogout, onLoggedOut }: LogoutDialogProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const { closeLastDialog } = useDialog()
  const logger = useLogger('LogoutComponent')
  const repo = useRepository()
  const localization = useLocalization().logout

  return (
    <>
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
              {localization.loggingOutFrom(repo.configuration.repositoryUrl)}
            </Typography>
          </div>
        ) : (
          <DialogContentText style={{ wordBreak: 'break-word' }}>
            {localization.logoutConfirmText(
              repo.configuration.repositoryUrl,
              userToLogout.DisplayName ?? userToLogout.Name,
            )}
          </DialogContentText>
        )}
      </DialogContent>
      {isLoggingOut ? null : (
        <DialogActions>
          <Button onClick={closeLastDialog}>{localization.logoutCancel}</Button>
          <Button
            onClick={async () => {
              try {
                setIsLoggingOut(true)
                await repo.authentication.logout().then(() => {
                  onLoggedOut?.()
                })
              } catch {
                /** ignore logout response parsing error */
              }
              closeLastDialog()
              logger.information({
                message: localization.logoutSuccessNotification(repo.configuration.repositoryUrl),
              })
            }}
            autoFocus={true}>
            {localization.logoutButtonTitle}
          </Button>
        </DialogActions>
      )}
    </>
  )
}

export default LogoutDialog
