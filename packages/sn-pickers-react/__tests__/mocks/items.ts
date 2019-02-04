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
