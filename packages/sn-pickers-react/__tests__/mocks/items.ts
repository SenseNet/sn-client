import { GenericContent } from '@sensenet/default-content-types'
import { Item } from '../../src/ListPicker/Item'

export interface MockData {
  text: string
  Id: string | number
}

export const items: Array<Item<MockData>> = [
  {
    nodeData: {
      Id: 1,
      text: 'Csiga',
    },
  },
  {
    nodeData: {
      Id: 2,
      text: 'Biga',
    },
  },
  {
    nodeData: {
      Id: 3,
      text: 'Sapka',
    },
  },
  {
    nodeData: {
      Id: 4,
      text: 'Kabát',
    },
  },
]

export const genericContentItems: Array<Item<GenericContent>> = [
  {
    nodeData: {
      Id: 1,
      Type: 'Folder',
      Path: 'path',
      Name: 'Csiga',
    },
  },
  {
    nodeData: {
      Id: 2,
      Type: 'Folder',
      Path: 'path',
      Name: 'Biga',
    },
  },
  {
    nodeData: {
      Id: 3,
      Type: 'Folder',
      Path: 'path',
      Name: 'Sapka',
    },
  },
  {
    nodeData: {
      Id: 4,
      Type: 'Folder',
      Path: 'path',
      Name: 'Kabát',
    },
  },
]
