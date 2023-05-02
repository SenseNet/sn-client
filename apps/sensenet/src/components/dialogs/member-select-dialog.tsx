import { Button, createStyles, DialogActions, DialogContent, IconButton, makeStyles, Theme } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { EntryType } from '@sensenet/client-core'
import { AutoComplete } from '@sensenet/controls-react'
import { Group, ReferenceFieldSetting, User } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import React, { useState } from 'react'
import { globals, useGlobalStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'
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
    localEntryTemplate.identity.kind = repository.schemas.isContentFromType(selectedMember, 'User') ? 'user' : 'group'
    if (repository.schemas.isContentFromType<User>(selectedMember, 'User')) {
      localEntryTemplate.identity.domain = selectedMember.Domain
      localEntryTemplate.identity.avatar = selectedMember.Avatar?.Url
    }
    return localEntryTemplate
  }

  return (
    <>
      <DialogTitle data-test={'member-select-dialog'}>
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
              SelectionRoots: ['/Root/IMS'],
              Name: localization.permissionEditor.name,
              DisplayName: localization.permissionEditor.name,
              Description: localization.permissionEditor.enterName,
            } as ReferenceFieldSetting
          }
        />
      </DialogContent>
      <DialogActions className={classes.dialogActions}>
        <Button aria-label={localization.forms.cancel} className={globalClasses.cancelButton} onClick={closeLastDialog}>
          {localization.forms.cancel}
        </Button>
        <Button
          data-test={'member-select-add'}
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
