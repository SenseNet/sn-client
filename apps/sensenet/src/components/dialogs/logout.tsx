import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core'
import { User } from '@sensenet/default-content-types'
import { useLogger, useRepository } from '@sensenet/hooks-react'
import React from 'react'
import { useHistory } from 'react-router'
import { useLocalization } from '../../hooks'
import { applicationPaths } from '../../services/auth-service'
import { Icon } from '../Icon'
import { useDialog } from './dialog-provider'

export type LogoutDialogProps = {
  userToLogout: User
  onLoggedOut?: () => void
}

export function LogoutDialog({ userToLogout }: LogoutDialogProps) {
  const { closeLastDialog } = useDialog()
  const logger = useLogger('LogoutComponent')
  const history = useHistory<{ local: boolean }>()
  const repo = useRepository()
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
            item={userToLogout}
          />
          {localization.logoutDialogTitle}
        </div>
      </DialogTitle>
      <DialogContent>
        <DialogContentText style={{ wordBreak: 'break-word' }}>
          {localization.logoutConfirmText(
            repo.configuration.repositoryUrl,
            userToLogout.DisplayName ?? userToLogout.Name,
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeLastDialog}>{localization.logoutCancel}</Button>
        <Button
          onClick={() => {
            closeLastDialog()
            history.push(applicationPaths.logOut, { local: true })
            logger.information({
              message: localization.logoutSuccessNotification(repo.configuration.repositoryUrl),
            })
          }}
          autoFocus={true}>
          {localization.logoutButtonTitle}
        </Button>
      </DialogActions>
    </>
  )
}

export default LogoutDialog
