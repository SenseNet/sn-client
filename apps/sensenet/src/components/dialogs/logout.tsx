import { Button, DialogActions, DialogContent, DialogContentText } from '@material-ui/core'
import { useRepository } from '@sensenet/hooks-react'
import React from 'react'
import { useAuth } from '../../context/auth-provider'
import { useGlobalStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'
import { clearActiveRepositorySelection } from '../../services/repository-session'
import { Icon } from '../Icon'
import { DialogTitle, useDialog } from '.'

export function LogoutDialog() {
  const { closeLastDialog } = useDialog()
  const { user, logout } = useAuth()
  const repository = useRepository()
  const localization = useLocalization().logout
  const globalClasses = useGlobalStyles()

  return (
    <>
      <DialogTitle>
        <div className={globalClasses.centered}>
          <Icon
            style={{
              margin: '0 1em 0 0',
            }}
            item={user}
          />
          {localization.logoutDialogTitle}
        </div>
      </DialogTitle>
      <>
        <DialogContent>
          <DialogContentText style={{ wordBreak: 'break-word' }}>
            {localization.logoutConfirmText(
              repository.configuration.repositoryUrl,
              user?.DisplayName ?? user?.Name ?? 'Visitor',
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            aria-label={localization.switchRepositoryButtonTitle}
            onClick={() => {
              clearActiveRepositorySelection()
              window.location.assign('/')
            }}>
            {localization.switchRepositoryButtonTitle}
          </Button>
          <Button
            aria-label={localization.logoutCancel}
            className={globalClasses.cancelButton}
            onClick={closeLastDialog}>
            {localization.logoutCancel}
          </Button>
          <Button
            aria-label={localization.logoutButtonTitle}
            color="primary"
            variant="contained"
            onClick={() => {
              clearActiveRepositorySelection()
              logout()
            }}
            autoFocus={true}>
            {localization.logoutButtonTitle}
          </Button>
        </DialogActions>
      </>
    </>
  )
}

export default LogoutDialog
