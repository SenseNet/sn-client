import { GenericContent } from '@sensenet/default-content-types'
import { Item } from '../../src/ListPicker/Item'

export interface MockData {
  text: string
}

export const items: Array<Item<MockData>> = [
  {
    id: 1,
    nodeData: {
      text: 'Csiga',
    },
  },
  {
    id: 2,
    nodeData: {
      text: 'Biga',
    },
  },
  {
    id: 3,
    nodeData: {
      text: 'Sapka',
    },
  },
  {
    id: 4,
    nodeData: {
      text: 'Kabát',
    },
  },
]

export const genericContentItems: Array<Item<GenericContent>> = [
  {
    id: 1,
    nodeData: {
      Id: 1,
      Type: 'Folder',
      Path: 'path',
      Name: 'Csiga',
    },
  },
  {
    id: 2,
    nodeData: {
      Id: 2,
      Type: 'Folder',
      Path: 'path',
      Name: 'Biga',
    },
  },
  {
    id: 3,
    nodeData: {
      Id: 3,
      Type: 'Folder',
      Path: 'path',
      Name: 'Sapka',
    },
  },
  {
    id: 4,
    nodeData: {
      Id: 4,
      Type: 'Folder',
      Path: 'path',
      Name: 'Kabát',
    },
  },
]
