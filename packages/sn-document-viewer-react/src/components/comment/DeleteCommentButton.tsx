import { Button } from '@material-ui/core'
import React, { useContext, useState } from 'react'
import { ConfirmationDialog } from '../ConfirmationDialog'
import { LocalizationContext } from '../../context/localization-context'
import { CommentPropType } from './Comment'

type DeleteButtonProps = Pick<CommentPropType, 'deleteComment' | 'id'>

/**
 * Represents a delete button with confirmation dialog
 */
export const DeleteButton: React.FC<DeleteButtonProps> = props => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const localization = useContext(LocalizationContext)

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
      <Button color="primary" size="small" onClick={handleClick}>
        {localization.delete || 'delete'}
      </Button>
      <ConfirmationDialog
        dialogTitle={localization.deleteCommentDialogTitle}
        cancelButtonText={localization.cancelButton}
        okButtonText={localization.okButton}
        isOpen={isDialogOpen}
        onClose={handleDialogClose}>
        {localization.deleteCommentDialogBody}
      </ConfirmationDialog>
    </>
  )
}
