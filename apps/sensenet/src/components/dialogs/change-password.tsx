import { Button, DialogActions, DialogContent } from '@material-ui/core'
import TextField from '@material-ui/core/TextField'
import { useLogger, useRepository } from '@sensenet/hooks-react'
import React, { useState } from 'react'
import { useCurrentUser } from '../../context'
import { useGlobalStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'
import { DialogTitle, useDialog } from '.'

type PasswordFieldKeys = 'oldPassword' | 'newPassword' | 'confirmPassword'

export function ChangePasswordDialog() {
  const { closeLastDialog } = useDialog()
  const localization = useLocalization().changePassword
  const logger = useLogger('change-password')
  const globalClasses = useGlobalStyles()
  const repo = useRepository()
  const currentUser = useCurrentUser()
  const [passwordFields, setPasswordFields] = useState<{
    [K in PasswordFieldKeys]?: string
  }>({})
  const [match, setMatch] = useState<boolean>(true)
  const [dirtyFlags, setDirtyFlags] = useState<{
    [K in PasswordFieldKeys]: boolean
  }>({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  })

  const onSubmit = async () => {
    if (!validate()) {
      setMatch(false)
      return false
    }

    try {
      await repo.executeAction({
        idOrPath: currentUser.Path,
        name: 'ChangePassword',
        method: 'POST',
        body: {
          oldPassword: passwordFields.oldPassword,
          password: passwordFields.newPassword,
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
    if (
      dirtyFlags.newPassword &&
      dirtyFlags.confirmPassword &&
      passwordFields.newPassword !== passwordFields.confirmPassword
    ) {
      return false
    }
    return true
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setPasswordFields({ ...passwordFields, [event.target.name]: event.target.value })
    setDirtyFlags({ ...dirtyFlags, [event.target.name]: true })
  }

  return (
    <>
      <DialogTitle>
        <div className={globalClasses.centered}>{localization.changeYourPassword}</div>
      </DialogTitle>
      <>
        <DialogContent>
          <TextField
            name="oldPassword"
            label={localization.oldPassword}
            multiline={false}
            rowsMax="4"
            value={passwordFields.oldPassword}
            onChange={(event) => handleInputChange(event)}
            margin="normal"
            fullWidth={true}
            placeholder={localization.oldPassword}
            type="password"
            required
          />
          <TextField
            name="newPassword"
            label={localization.newPassword}
            multiline={false}
            rowsMax="4"
            value={passwordFields.newPassword}
            onChange={(event) => handleInputChange(event)}
            onBlur={() => setMatch(validate())}
            margin="normal"
            fullWidth={true}
            placeholder={localization.newPassword}
            type="password"
            required
          />
          <TextField
            name="confirmPassword"
            label={localization.confirmNew}
            multiline={false}
            rowsMax="4"
            value={passwordFields.confirmPassword}
            onChange={(event) => handleInputChange(event)}
            onBlur={() => setMatch(validate())}
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
            disabled={
              !passwordFields.oldPassword || !passwordFields.newPassword || !passwordFields.confirmPassword || !match
            }
            autoFocus={true}>
            {localization.update}
          </Button>
        </DialogActions>
      </>
    </>
  )
}

export default ChangePasswordDialog
