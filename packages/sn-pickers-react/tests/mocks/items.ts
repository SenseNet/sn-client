import { GenericContent } from '@sensenet/default-content-types'

export const mockContent = { Id: 1, Type: 'Folder', Path: '', Name: 'MockFolder' }

export const genericContentItems: Array<GenericContent & { isParent?: boolean }> = [
  {
    Id: 1,
    Type: 'Folder',
    Path: 'path1',
    Name: 'Content1',
    DisplayName: 'Content 1',
    IsFolder: true,
    isParent: true,
  },
  {
    Id: 2,
    Type: 'Folder',
    Path: 'path2',
    Name: 'Content2',
    DisplayName: 'Content 2',
  },
  {
    Id: 3,
    Type: 'Folder',
    Path: 'path3',
    Name: 'Content3',
    DisplayName: 'Content 3',
    IsFolder: true,
  },
  {
    Id: 4,
    Type: 'Folder',
    Path: 'path4',
    Name: 'Content4',
    DisplayName: 'Content 4',
  },
  {
    Id: 5,
    Type: 'Folder',
    Path: 'path5',
    Name: 'Content5',
    DisplayName: 'Content 5',
    IsFolder: false,
    isParent: true,
  },
]
