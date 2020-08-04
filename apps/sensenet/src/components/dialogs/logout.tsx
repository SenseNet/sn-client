import { useOidcAuthentication } from '@sensenet/authentication-oidc-react'
import { useRepository } from '@sensenet/hooks-react'
import { Button, DialogActions, DialogContent, DialogContentText } from '@material-ui/core'
import React from 'react'
import { authConfigKey, useCurrentUser } from '../../context'
import { useGlobalStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'
import { Icon } from '../Icon'
import { DialogTitle, useDialog } from '.'

export function LogoutDialog() {
  const { closeLastDialog } = useDialog()
  const currentUser = useCurrentUser()
  const { logout } = useOidcAuthentication()
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
              transition: 'filter linear 1s, opacity linear 1.5s',
            }}
            item={currentUser}
          />
          {localization.logoutDialogTitle}
        </div>
      </DialogTitle>
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
              window.localStorage.removeItem(authConfigKey)
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
