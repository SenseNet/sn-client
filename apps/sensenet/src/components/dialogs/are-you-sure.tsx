import React from 'react'
import { Button, DialogActions, DialogContent, DialogTitle } from '@material-ui/core'
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

  return (
    <>
      <DialogTitle>{titleText}</DialogTitle>
      <DialogContent dangerouslySetInnerHTML={{ __html: bodyText }} />
      <DialogActions>
        <Button onClick={() => callBack()}>{submitText}</Button>
        <Button onClick={() => closeLastDialog()}>{cancelText}</Button>
      </DialogActions>
    </>
  )
}

export default AreYouSure
