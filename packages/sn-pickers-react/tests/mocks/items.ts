import { GenericContent } from '@sensenet/default-content-types'

export const mockContent = { Id: 1, Type: 'Folder', Path: '', Name: 'MockFolder' }

export const genericContentItems: Array<GenericContent & { isParent?: boolean }> = [
  {
    Id: 1,
    Type: 'Folder',
    Path: 'path',
    Name: 'Content1',
    DisplayName: 'Content 1',
    isParent: true,
  },
  {
    Id: 2,
    Type: 'Folder',
    Path: 'path',
    Name: 'Content2',
    DisplayName: 'Content 2',
  },
  {
    Id: 3,
    Type: 'Folder',
    Path: 'path',
    Name: 'Content3',
    DisplayName: 'Content 3',
  },
  {
    Id: 4,
    Type: 'Folder',
    Path: 'path',
    Name: 'Content4',
    DisplayName: 'Content 4',
  },
]
