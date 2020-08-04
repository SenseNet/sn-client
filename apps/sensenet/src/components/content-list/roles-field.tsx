import { GenericContent, Group, User } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import { Button, Menu, MenuItem, TableCell } from '@material-ui/core'
import SwapHorizIcon from '@material-ui/icons/SwapHoriz'
import clsx from 'clsx'
import React, { FunctionComponent, useState } from 'react'
import { useGlobalStyles } from '../../globalStyles'
import { useDialog } from '../dialogs'

interface RolesFieldProps {
  roles: GenericContent[]
  directRoles?: GenericContent[]
}

export const RolesField: FunctionComponent<RolesFieldProps> = ({ roles, directRoles }) => {
  const globalClasses = useGlobalStyles()
  const repository = useRepository()
  const { openDialog } = useDialog()
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const listed = roles.slice(0, 2)
  const rest = roles.slice(2)

  const openGroupDialog = async (event: React.MouseEvent, group: Group) => {
    event.stopPropagation()
    const actions = await repository.getActions({ idOrPath: group.Path })
    const content = await repository.load<Group>({
      idOrPath: group.Path,
      oDataOptions: {
        select: ['Members'],
        expand: ['Members'],
      },
    })
    const canEdit = actions.d.results.some((action) => action.Name === 'Edit')

    openDialog({
      name: 'reference-content-list',
      props: { items: content.d.Members as User[], parent: group, fieldName: 'Members', canEdit },
      dialogProps: { maxWidth: 'sm', classes: { container: globalClasses.centeredRight } },
    })
  }

  const isIndirect = (role: GenericContent) => {
    if (!directRoles) {
      return false
    }

    return !directRoles.some((directRole) => directRole.Id === role.Id)
  }

  return (
    <TableCell className={clsx(globalClasses.centeredLeft, globalClasses.virtualizedCellStyle)} component="div">
      {listed.map((role) => (
        <Button
          key={role.Id}
          variant="contained"
          color="primary"
          size="small"
          style={{ marginRight: '0.5rem' }}
          endIcon={isIndirect(role) ? <SwapHorizIcon /> : undefined}
          onClick={async (event) => openGroupDialog(event, role)}>
          {role.DisplayName}
        </Button>
      ))}

      {rest.length > 0 && (
        <>
          <Button
            aria-controls="more-roles"
            aria-haspopup="true"
            variant="contained"
            color="primary"
            size="small"
            onClick={(event) => {
              event.stopPropagation()
              setAnchorEl(event.currentTarget)
            }}>
            {rest.length} more
          </Button>
          <Menu id="simple-roles" keepMounted anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
            {rest.map((role) => (
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
          </Menu>
        </>
      )}
    </TableCell>
  )
}
