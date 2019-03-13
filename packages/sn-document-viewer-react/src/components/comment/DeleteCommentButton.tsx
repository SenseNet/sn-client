import Button from '@material-ui/core/Button'
import React, { useState } from 'react'
import { ConfirmationDialog } from '../ConfirmationDialog'
import { CommentPropType } from './Comment'

type DeleteButtonProps = Pick<CommentPropType, 'deleteComment' | 'id' | 'localization'>

/**
 * Represents a delete button with confirmation dialog
 */
export const DeleteButton = (props: DeleteButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleClick = () => {
    setIsDialogOpen(true)
  }

  const handleDialogClose = (isCanceled: boolean) => {
    if (!isCanceled) {
      props.deleteComment(props.id)
    }
    setIsDialogOpen(false)
  }

  return (
    <>
      <Button size="small" onClick={handleClick}>
        {props.localization.delete || 'delete'}
      </Button>
      <ConfirmationDialog
        dialogTitle={props.localization.deleteCommentDialogTitle}
        cancelButtonText={props.localization.cancelButton}
        okButtonText={props.localization.okButton}
        isOpen={isDialogOpen}
        onClose={handleDialogClose}>
        {props.localization.deleteCommentDialogBody}
      </ConfirmationDialog>
    </>
  )
}
