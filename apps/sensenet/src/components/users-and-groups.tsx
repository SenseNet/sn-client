import People from '@material-ui/icons/People'
import Person from '@material-ui/icons/Person'
import { GenericContent } from '@sensenet/default-content-types'
import React, { FunctionComponent } from 'react'
import { PATHS } from '../application-paths'
import { useGridSwitcher, useLocalization } from '../hooks'
import { Content } from './content'
import { PageTitle } from './PageTitle'

const gridSwitcherConfig = [
  {
    icon: <Person />,
    displayName: 'Users',
    name: 'users',
    schema: 'User',
    fieldsToDisplay: [
      { field: 'DisplayName' as keyof GenericContent },
      { field: 'Email' as keyof GenericContent },
      { field: 'AllRoles' as keyof GenericContent },
      { field: 'Enabled' as keyof GenericContent },
      { field: 'Actions' as keyof GenericContent },
    ],
    loadSettings: { filter: "isOf('User')", expand: ['DirectRoles', 'AllRoles', 'CheckedOutTo'] as any },
  },
  {
    icon: <People />,
    displayName: 'Groups',
    name: 'groups',
    schema: 'Group',
    fieldsToDisplay: [
      { field: 'DisplayName' as keyof GenericContent },
      { field: 'Description' as keyof GenericContent },
      { field: 'Members' as keyof GenericContent },
      { field: 'Actions' as keyof GenericContent },
    ],
    loadSettings: { filter: "isOf('Group')" },
  },
]

const UsersAndGroups: FunctionComponent = () => {
  const gridSwitcher = useGridSwitcher({ config: gridSwitcherConfig, defaultItem: gridSwitcherConfig[0] })
  const localization = useLocalization()

  return (
    <>
      <PageTitle title={localization.pageTitles.usersAndGroup} />
      <Content
        rootPath={PATHS.usersAndGroups.snPath}
        fieldsToDisplay={gridSwitcher.activeItem.fieldsToDisplay as any}
        renderBeforeGrid={(): JSX.Element => <div style={{ margin: '10px 12px' }}>{gridSwitcher.renderButtons()}</div>}
        schema={gridSwitcher.activeItem.schema}
        loadChildrenSettings={gridSwitcher.activeItem.loadSettings}
      />
    </>
  )
}

export default UsersAndGroups
