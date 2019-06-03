import { Repository } from '@sensenet/client-core'
import { ContentType, GenericContent } from '@sensenet/default-content-types'

export const repository = new Repository({
  repositoryUrl: process.env.REACT_APP_SERVICE_URL,
  requiredSelect: [
    'Id',
    'Path',
    'Name',
    'Type',
    'ParentId',
    'Actions',
    'Owner',
    'DisplayName',
    'Locked',
    'CheckedOutTo',
    'Approvable',
  ],
  defaultExpand: ['Actions', 'Owner', 'CheckedOutTo'],
  sessionLifetime: 'expiration',
})

export const content = {
  Id: 2,
  Path: '/workspaces/Lorem ipsum',
  Name: 'Lorem_ipsum',
  Type: 'GenericContent',
  ParentId: 1,
  DisplayName: 'Lorem ipsum',
  Locked: false,
} as GenericContent

export const allowedChildTypes = [
  {
    Name: 'Folder',
    DisplayName: 'Folder',
    Icon: 'folder',
  } as ContentType,
  {
    Name: 'File',
    DisplayName: 'File',
    Icon: 'word',
  } as ContentType,
]
