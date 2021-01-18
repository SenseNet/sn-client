import { useLogger, useRepository } from '@sensenet/hooks-react'
import { Button, DialogActions, DialogContent } from '@material-ui/core'
import TextField from '@material-ui/core/TextField'
import React, { useState } from 'react'
import { useCurrentUser } from '../../context'
import { useGlobalStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'
import { DialogTitle, useDialog } from '.'

export function ChangePasswordDialog() {
  const { closeLastDialog } = useDialog()
  const localization = useLocalization().changePassword
  const logger = useLogger('change-password')
  const globalClasses = useGlobalStyles()
  const repo = useRepository()
  const currentUser = useCurrentUser()
  const [oldPassword, setOldPassword] = useState<string>()
  const [newPassword, setNewPassword] = useState<string>()
  const [confirmPassword, setConfirmPassword] = useState<string>()
  const [match, setMatch] = useState<boolean>()

  const onSubmit = async () => {
    try {
      await repo.executeAction({
        idOrPath: currentUser.Path,
        name: 'ChangePassword',
        method: 'POST',
        body: {
          oldPassword,
          password: newPassword,
        },
      })
      logger.information({ message: localization.changePasswordSuccess })
    } catch (error) {
      logger.warning({ message: error.message })
    } finally {
      closeLastDialog()
    }
  }

  const validate = () => {
    if (typeof newPassword !== 'undefined' && typeof confirmPassword !== 'undefined') {
      if (newPassword !== confirmPassword) {
        setMatch(false)
      } else {
        setMatch(true)
      }
    }
  }

  return (
    <>
      <DialogTitle>
        <div className={globalClasses.centered}>{localization.changeYourPassword}</div>
      </DialogTitle>
      <>
        <DialogContent>
          <TextField
            label={localization.oldPassword}
            multiline={false}
            rowsMax="4"
            value={oldPassword}
            onChange={(event) => setOldPassword(event.target.value)}
            margin="normal"
            fullWidth={true}
            placeholder={localization.oldPassword}
            type="password"
            required
          />
          <TextField
            label={localization.newPassword}
            multiline={false}
            rowsMax="4"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            onBlur={() => validate()}
            margin="normal"
            fullWidth={true}
            placeholder={localization.newPassword}
            type="password"
            required
          />
          <TextField
            label={localization.confirmNew}
            multiline={false}
            rowsMax="4"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            onBlur={() => validate()}
            margin="normal"
            fullWidth={true}
            placeholder={localization.confirmNew}
            type="password"
            required
            error={!match}
            helperText={!match && localization.passwordsDontMatch}
          />
        </DialogContent>
        <DialogActions>
          <Button aria-label={localization.cancel} className={globalClasses.cancelButton} onClick={closeLastDialog}>
            {localization.cancel}
          </Button>
          <Button
            aria-label={localization.update}
            color="primary"
            variant="contained"
            onClick={onSubmit}
            disabled={!oldPassword || !newPassword || !confirmPassword || !match}
            autoFocus={true}>
            {localization.update}
          </Button>
        </DialogActions>
      </>
    </>
  )
}

export default ChangePasswordDialog
