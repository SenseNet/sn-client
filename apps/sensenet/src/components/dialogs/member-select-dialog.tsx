import { EntryType } from '@sensenet/client-core'
import { Group, ReferenceFieldSetting, User } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import { Button, createStyles, DialogActions, DialogContent, IconButton, makeStyles, Theme } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import React, { useState } from 'react'
import { globals, useGlobalStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'
import { AutoComplete } from '../field-controls/AutoComplete'
import { entryTemplate } from './member-select/entryTemplate'
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
    dialogActions: {
      padding: '16px',
    },
  })
})

export type MemberSelectProps = {
  currentContentPath?: string
  callbackAfterSelect?: (newEntry: EntryType) => void
}

export function MemberSelect(props: MemberSelectProps) {
  const classes = useStyles()
  const globalClasses = useGlobalStyles()
  const localization = useLocalization()
  const repository = useRepository()
  const { closeLastDialog } = useDialog()

  const [selectedMember, setSelectedMember] = useState<User | Group>()

  const fillTemplateWithIdentityValues = () => {
    const localEntryTemplate = { ...entryTemplate }
    localEntryTemplate.identity.id = selectedMember!.Id
    localEntryTemplate.identity.path = selectedMember!.Path
    localEntryTemplate.identity.name = selectedMember!.Name
    localEntryTemplate.identity.displayName = selectedMember!.DisplayName
    localEntryTemplate.identity.kind = selectedMember!.Type === 'User' ? 'user' : 'group'
    if (selectedMember!.Type === 'User') {
      localEntryTemplate.identity.domain = (selectedMember as User).Domain
      localEntryTemplate.identity.avatar = (selectedMember as User).Avatar?.Url
    }
    return localEntryTemplate
  }

  return (
    <>
      <DialogTitle>
        {localization.permissionEditor.newEntry}
        <IconButton aria-label="close" className={classes.closeButton} onClick={closeLastDialog}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <AutoComplete
          actionName="new"
          fieldOnChange={(_fieldName, newMember) => setSelectedMember(newMember)}
          repository={repository}
          settings={
            {
              AllowedTypes: ['User', 'Group'],
              SelectionRoots: ['/Root/IMS/Public'],
              Name: 'Name',
              DisplayName: 'Name',
              Description: 'Type in a name',
            } as ReferenceFieldSetting
          }
        />
      </DialogContent>
      <DialogActions className={classes.dialogActions}>
        <Button aria-label={localization.forms.cancel} className={globalClasses.cancelButton} onClick={closeLastDialog}>
          {localization.forms.cancel}
        </Button>
        <Button
          aria-label={localization.permissionEditor.add}
          color="primary"
          variant="contained"
          autoFocus={true}
          disabled={!selectedMember}
          onClick={() => {
            if (selectedMember) {
              const newEntry = fillTemplateWithIdentityValues()
              closeLastDialog()
              props.callbackAfterSelect?.(newEntry)
            }
          }}>
          {localization.permissionEditor.add}
        </Button>
      </DialogActions>
    </>
  )
}

export default MemberSelect
