import { Button, DialogActions, DialogContent, DialogTitle } from '@material-ui/core'
import React from 'react'
import { useGlobalStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'
import { useDialog } from './dialog-provider'

export type AreYouSureProps = {
  bodyText?: string
  titleText?: string
  cancelText?: string
  submitText?: string
  callBack: () => void
}

export function AreYouSure(props: AreYouSureProps) {
  const localization = useLocalization().areYouSureDialog
  const {
    callBack,
    bodyText = localization.body,
    submitText = localization.submitButton,
    cancelText = localization.cancelButton,
    titleText = localization.title,
  } = props
  const { closeLastDialog } = useDialog()
  const globalClasses = useGlobalStyles()

  return (
    <>
      <DialogTitle>{titleText}</DialogTitle>
      <DialogContent dangerouslySetInnerHTML={{ __html: bodyText }} />
      <DialogActions>
        <Button aria-label={submitText} color="primary" variant="contained" onClick={() => callBack()}>
          {submitText}
        </Button>
        <Button aria-label={cancelText} className={globalClasses.cancelButton} onClick={() => closeLastDialog()}>
          {cancelText}
        </Button>
      </DialogActions>
    </>
  )
}

export default AreYouSure
