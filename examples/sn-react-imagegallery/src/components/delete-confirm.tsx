import { IconButton, makeStyles } from '@material-ui/core'
import { Delete } from '@material-ui/icons'
import { Image } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import React, { FunctionComponent } from 'react'
import { AlertDialog } from './alert-dialog'

export const useStyles = makeStyles((theme) => ({
  icon: {
    color: theme.palette.common.white,
    padding: 8,
  },
}))

export type DeleteConfirmClassKey = Partial<ReturnType<typeof useStyles>>

interface DeleteConfirmProps {
  tile: Image
  classes?: DeleteConfirmClassKey
  deleteCallback?: () => void
  cancelCallback?: () => void
}

export const DeleteConfirm: FunctionComponent<DeleteConfirmProps> = (props) => {
  const repository = useRepository()
  const classes = useStyles()

  return (
    <AlertDialog
      title={`Are you sure you want to delete this photo?`}
      content={
        <>
          <div>
            <strong>Name:</strong> {props.tile.DisplayName}
          </div>
          {props.tile.Description && (
            <div>
              <strong>Description:</strong> {props.tile.Description}
            </div>
          )}
        </>
      }
      okText="Confirm"
      cancelText="Cancel"
      handleOkClick={async () => {
        await repository.delete({
          idOrPath: props.tile.Id,
        })
        props.deleteCallback?.()
      }}
      handleCancelClick={() => props.cancelCallback?.()}
      renderOpenController={(handleClickOpen) => (
        <IconButton
          aria-label="delete"
          className={props.classes?.icon ?? classes.icon}
          onClick={() => handleClickOpen()}>
          <Delete />
        </IconButton>
      )}
    />
  )
}
