import { GenericContent } from '@sensenet/default-content-types'
import { createStyles, DialogContent, IconButton, makeStyles, Theme } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import React from 'react'
import { globals } from '../../globalStyles'
import { ReferenceList } from './reference-content-list/reference-list'
import { DialogTitle, useDialog } from '.'

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    closeButton: {
      position: 'absolute',
      right: theme.spacing(3),
      top: 0,
      color: globals.common.headerText,

      '&:hover': {
        backgroundColor: '#3c4359',
      },
    },
  })
})

export type ReferenceContentListProps = {
  items: GenericContent[]
  parent: GenericContent
  fieldName: string
  canEdit: boolean
}

export function ReferenceContentList(props: ReferenceContentListProps) {
  const { closeLastDialog } = useDialog()
  const classes = useStyles()

  return (
    <>
      <DialogTitle>
        {props.parent.DisplayName}
        <IconButton aria-label="close" className={classes.closeButton} onClick={closeLastDialog}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <ReferenceList canEdit={props.canEdit} parent={props.parent} fieldName={props.fieldName} items={props.items} />
      </DialogContent>
    </>
  )
}

export default ReferenceContentList
