import ListItem from '@material-ui/core/ListItem/ListItem'
import ListItemText from '@material-ui/core/ListItemText/ListItemText'
import { GenericContent } from '@sensenet/default-content-types'
import { App } from '@sensenet/pickers-react/example/ExampleApp'
import { ListPickerComponent } from '@sensenet/pickers-react/src/ListPicker'
import { storiesOf } from '@storybook/react'
import React from 'react'
const showCaseAppNotes = require('../notes/pickers/ConnectedToDms.md')

export const mockContent = { Id: 1, Type: 'Folder', Path: '', Name: 'MockFolder' }

export const genericContentItems: GenericContent[] = [
  {
    Id: 1,
    Type: 'Folder',
    Path: 'path',
    Name: 'Content1',
    DisplayName: 'Content 1',
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

storiesOf('ListPicker', module)
  .add('Connected to repository', () => <App />, { showCaseAppNotes })
  .add('With default parameters', () => (
    <ListPickerComponent
      loadParent={() => Promise.resolve(mockContent)}
      loadItems={() => Promise.resolve(genericContentItems)}
    />
  ))
  .add('With custom renderer', () => (
    <ListPickerComponent
      loadParent={() => Promise.resolve(mockContent)}
      loadItems={() => Promise.resolve(genericContentItems)}
      renderItem={props => (
        <ListItem>
          <ListItemText primary={props.Name} />
        </ListItem>
      )}
    />
  ))
