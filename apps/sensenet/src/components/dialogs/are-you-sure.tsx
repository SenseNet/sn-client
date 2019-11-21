import React from 'react'
import { Button, DialogActions, DialogContent, DialogTitle } from '@material-ui/core'
import { useDialog } from './dialog-provider'

export type AreYouSureProps = {
  bodyText?: string
  titleText?: string
  cancelText?: string
  submitText?: string
  callBack: () => void
}

export function AreYouSure(props: AreYouSureProps) {
  const {
    callBack,
    bodyText = 'Are you absolutely sure?',
    submitText = 'Yes',
    cancelText = 'Cancel',
    titleText = 'Are you sure?',
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
