import {
  Button,
  DialogContent,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from '@material-ui/core'
import { GroupOutlined } from '@material-ui/icons'
import AddIcon from '@material-ui/icons/Add'
import ClearIcon from '@material-ui/icons/Clear'
import CloseIcon from '@material-ui/icons/Close'
import { AutoComplete } from '@sensenet/controls-react'
import { GenericContent, Group, ReferenceFieldSetting, User } from '@sensenet/default-content-types'
import { useLogger, useRepository } from '@sensenet/hooks-react'
import React, { FunctionComponent, useState } from 'react'
import { useLocalization } from '../../hooks'
import { DialogTitle, useDialog, useStyles } from '.'

export interface AddDeleteUserGroupsProps {
  user: User
  directGroups: GenericContent[]
  canEdit: boolean
}

export const AddDeleteUserGroups: FunctionComponent<AddDeleteUserGroupsProps> = ({ user, directGroups, canEdit }) => {
  const { closeLastDialog } = useDialog()
  const repository = useRepository()
  const classes = useStyles()
  const [selectedGroup, setSelectedGroup] = useState<Group | null>()
  const [groups, setGroups] = useState<GenericContent[]>(directGroups)
  const logger = useLogger('AddDeleteUserGroups')
  const localization = useLocalization()

  const searchInGroups = (group: Group) => {
    setSelectedGroup(group && groups.every((e) => e.Id !== group.Id) ? group : null)
  }

  const handleOnSubmit = async (): Promise<void> => {
    if (selectedGroup) {
      try {
        await repository.security.addMembers(selectedGroup.Path, [user.Id])

        setGroups([...groups, selectedGroup])
        setSelectedGroup(null)
      } catch (e) {
        logError(selectedGroup)
      }
    }
  }

  const handleOnDelete = async (group: GenericContent): Promise<void> => {
    try {
      await repository.security.removeMembers(group.Path, [user.Id])

      setGroups(groups.filter((e) => e.Id !== group.Id))
    } catch (e) {
      logError(group)
    }
  }

  const logError = (relatedContent: GenericContent) => {
    logger.warning({
      message: localization.referenceContentListDialog.errorAlreadyInList,
      data: {
        relatedContent,
        relatedRepository: repository.configuration.repositoryUrl,
      },
    })
  }

  return (
    <>
      <DialogTitle>
        {localization.addDeleteUserGroups.groups}
        <IconButton aria-label="close" className={classes.closeButton} onClick={closeLastDialog}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <AutoComplete
            actionName="new"
            fieldOnChange={(_fieldName, group) => searchInGroups(group)}
            repository={repository}
            settings={
              {
                AllowedTypes: ['Group'],
                SelectionRoots: ['/Root/IMS'],
                DisplayName: localization.addDeleteUserGroups.groups,
                Description: localization.addDeleteUserGroups.search,
              } as ReferenceFieldSetting
            }
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            disabled={!selectedGroup}
            style={{ marginLeft: '0.5rem' }}
            onClick={(_) => handleOnSubmit()}>
            {localization.drawer.add}
          </Button>
        </div>
        <List>
          <div style={{ margin: '1rem 0' }}>
            {groups.length
              ? `${localization.addDeleteUserGroups.userGroups(user.DisplayName!)}:`
              : localization.addDeleteUserGroups.userNoMembership(user.DisplayName!)}
          </div>
          {groups.length ? (
            groups.map((group) => (
              <ListItem key={group.Id}>
                <GroupOutlined />
                <ListItemText style={{ marginLeft: '0.5rem' }} primary={group.DisplayName} />
                {canEdit && (
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete" onClick={(_) => handleOnDelete(group)}>
                      <ClearIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
            ))
          ) : (
            <></>
          )}
        </List>
      </DialogContent>
    </>
  )
}

export default AddDeleteUserGroups
