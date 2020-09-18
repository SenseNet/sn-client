import { GenericContent } from '@sensenet/default-content-types'
import { Button, createStyles, makeStyles } from '@material-ui/core'
import React from 'react'
import { useLocalization } from '../../../hooks'
import { ReferenceList } from '../reference-content-list/reference-list'

const useStyles = makeStyles(() => {
  return createStyles({
    addNewButton: {
      border: 'none !important',
      textDecoration: 'underline',
      textTransform: 'none',
    },
  })
})

export type PermissionEditorMembersProps = {
  items: GenericContent[]
  parent: GenericContent
  fieldName: string
  canEdit: boolean
}

export function PermissionEditorMembers(props: PermissionEditorMembersProps) {
  const classes = useStyles()
  const localization = useLocalization()

  return (
    <ReferenceList
      canEdit={props.canEdit}
      parent={props.parent}
      fieldName={props.fieldName}
      items={props.items}
      renderButton={(newRef) => (
        <Button variant="outlined" color="primary" disabled={!newRef} type="submit" className={classes.addNewButton}>
          {localization.permissionEditor.addNewMember}
        </Button>
      )}
      formStyle={{ justifyContent: 'space-between', padding: '10px 20px' }}
      listStyle={{ padding: '0 30px', minHeight: '310px' }}
    />
  )
}
