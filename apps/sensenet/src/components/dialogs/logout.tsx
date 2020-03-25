import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core'
import { useOidcAuthentication } from '@sensenet/authentication-oidc-react'
import { useRepository } from '@sensenet/hooks-react'
import React from 'react'
import { useCurrentUser } from '../../context'
import { useGlobalStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'
import { Icon } from '../Icon'
import { useDialog } from './dialog-provider'

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
        <div className={globalClasses.centeredVertical}>
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
          <Button onClick={closeLastDialog}>{localization.logoutCancel}</Button>
          <Button
            onClick={() => {
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
