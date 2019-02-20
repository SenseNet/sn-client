import ListItem from '@material-ui/core/ListItem/ListItem'
import ListItemText from '@material-ui/core/ListItemText/ListItemText'
import { genericContentItems, mockContent } from '@sensenet/pickers-react/__tests__/mocks/items'
import { App } from '@sensenet/pickers-react/example/ExampleApp'
import { ListPickerComponent } from '@sensenet/pickers-react/src/ListPicker'
import { storiesOf } from '@storybook/react'
import React from 'react'
const showCaseAppNotes = require('../notes/pickers/ConnectedToDms.md')

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
