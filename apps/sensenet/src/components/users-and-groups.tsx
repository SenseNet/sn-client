import People from '@material-ui/icons/People'
import Person from '@material-ui/icons/Person'
import React from 'react'
import { PATHS } from '../application-paths'
import { useGridSwitcher } from '../hooks'
import { Content } from './content'

const gridSwitcherConfig = [
  {
    icon: <Person />,
    displayName: 'Users',
    name: 'users',
    schema: 'User',
    fieldsToDisplay: ['DisplayName', 'Email', 'AllRoles', 'Enabled', 'Actions'],
    loadSettings: { filter: "isOf('User')" },
  },
  {
    icon: <People />,
    displayName: 'Groups',
    name: 'groups',
    schema: 'Group',
    fieldsToDisplay: ['DisplayName', 'Description', 'Members', 'Actions'],
    loadSettings: { filter: "isOf('Group')" },
  },
]

const UsersAndGroups: React.FunctionComponent = () => {
  const gridSwitcher = useGridSwitcher({ config: gridSwitcherConfig, defaultItem: gridSwitcherConfig[0] })

  return (
    <Content
      rootPath={PATHS.usersAndGroups.snPath}
      fieldsToDisplay={gridSwitcher.activeItem.fieldsToDisplay as any}
      renderBeforeGrid={(): JSX.Element => <div style={{ margin: '10px 12px' }}>{gridSwitcher.renderButtons()}</div>}
      schema={gridSwitcher.activeItem.schema}
      loadChildrenSettings={gridSwitcher.activeItem.loadSettings}
    />
  )
}

export default UsersAndGroups
