import { storiesOf } from '@storybook/react'
import React from 'react'

import { GenericContent } from '@sensenet/default-content-types'
import { Item, ListPickerComponent } from '@sensenet/pickers-react/src/ListPicker'

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

const loadItems = () => Promise.resolve(genericContentItems)

storiesOf('ListPicker', module).add('default', () => <ListPickerComponent loadItems={loadItems} />)
