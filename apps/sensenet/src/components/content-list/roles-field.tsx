import { GenericContent, Group, User } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import { Button, createStyles, makeStyles, Menu, MenuItem, TableCell, Tooltip } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import SwapHorizIcon from '@material-ui/icons/SwapHoriz'
import clsx from 'clsx'
import React, { FunctionComponent, useState } from 'react'
import { useGlobalStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'
import { useDialog } from '../dialogs'

const useStyles = makeStyles(() => {
  return createStyles({
    label: {
      display: 'block',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  })
})

interface RolesFieldProps {
  user: GenericContent
  roles: GenericContent[]
  directRoles?: GenericContent[]
}

export const RolesField: FunctionComponent<RolesFieldProps> = ({ user, roles, directRoles }) => {
  const classes = useStyles()
  const globalClasses = useGlobalStyles()
  const repository = useRepository()
  const localization = useLocalization()
  const { openDialog } = useDialog()
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const openGroupDialog = async (event: React.MouseEvent, group: Group) => {
    event.stopPropagation()

    const canEdit = await canUserEditContent(group)

    const content = await repository.load<Group>({
      idOrPath: group.Path,
      oDataOptions: {
        select: ['Members'],
        expand: ['Members'],
      },
    })

    openDialog({
      name: 'reference-content-list',
      props: { items: content.d.Members as User[], parent: group, fieldName: 'Members', canEdit },
      dialogProps: { maxWidth: 'sm', classes: { container: globalClasses.centeredRight } },
    })
  }

  const openAddToGroupDialog = async (event: React.MouseEvent) => {
    event.stopPropagation()

    const canEdit = await canUserEditContent(user)

    openDialog({
      name: 'add-delete-user-groups',
      props: { user, directGroups: directRoles ?? [], canEdit },
      dialogProps: { maxWidth: 'sm', classes: { container: globalClasses.centeredRight } },
    })
  }

  const isIndirect = (role: GenericContent) => {
    if (!directRoles) {
      return false
    }

    return !directRoles.some((directRole) => directRole.Id === role.Id)
  }

  const canUserEditContent = async (content: GenericContent): Promise<boolean> => {
    const actions = await repository.getActions({ idOrPath: content.Path })
    return actions.d.results.some((action) => action.Name === 'Edit')
  }

  return (
    <TableCell className={clsx(globalClasses.centeredLeft, globalClasses.virtualizedCellStyle)} component="div">
      <Tooltip
        className={globalClasses.centered}
        title={roles.length === 1 ? roles[0].DisplayName! : `${roles.length} roles`}
        placement="top">
        <Button
          classes={{
            label: classes.label,
          }}
          aria-controls="more-roles"
          aria-haspopup="true"
          variant="contained"
          color="primary"
          size="small"
          onClick={(event) => {
            event.stopPropagation()
            setAnchorEl(event.currentTarget)
          }}>
          {roles.length === 1 ? roles[0].DisplayName! : `${roles.length} roles`}
        </Button>
      </Tooltip>
      <Menu id="simple-roles" keepMounted anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
        {roles.map((role) => (
          <MenuItem
            key={role.Id}
            onClick={async (event) => {
              openGroupDialog(event, role)
              setAnchorEl(null)
            }}>
            {role.DisplayName}
            {isIndirect(role) && (
              <div style={{ display: 'flex', paddingLeft: '6px' }}>
                <SwapHorizIcon />
              </div>
            )}
          </MenuItem>
        ))}
        <MenuItem
          onClick={async (event) => {
            openAddToGroupDialog(event)
            setAnchorEl(null)
          }}>
          {localization.addDeleteUserGroups.addToGroup}
          <div style={{ display: 'flex', paddingLeft: '6px' }}>
            <AddIcon fontSize="small" />
          </div>
        </MenuItem>
      </Menu>
    </TableCell>
  )
}
