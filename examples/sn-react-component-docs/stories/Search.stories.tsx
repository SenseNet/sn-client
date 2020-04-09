import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import { Repository } from '@sensenet/client-core'
import { sleepAsync } from '@sensenet/client-utils'
import { Folder, PortalSettings, User } from '@sensenet/default-content-types'
import { GenericContent } from '@sensenet/default-content-types/src'
import { Query } from '@sensenet/query'
import {
  AdvancedSearch,
  NestedTextField,
  PresetField,
  ReferenceField,
  TextField,
  TypeField,
} from '@sensenet/search-react/src'
import { ExampleApp } from '@sensenet/search-react/src/ExampleApp'
import { withA11y } from '@storybook/addon-a11y'
import { action } from '@storybook/addon-actions'
import { withActions } from '@storybook/addon-actions/dist/preview'
import { withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import React from 'react'

import showcaseNotes from '../notes/search/Showcase.md'
import advancedSearchNotes from '../notes/search/AdvancedSearch.md'
import presetFieldNotes from '../notes/search/PresetField.md'
import referenceFieldNotes from '../notes/search/ReferenceField.md'
import textFieldNotes from '../notes/search/TextField.md'
import nestedTextFieldNotes from '../notes/search/NestedTextField.md'
import typeFieldNotes from '../notes/search/TypeField.md'

storiesOf('Search', module)
  .addDecorator(withKnobs)
  .addDecorator(withA11y)
  .addDecorator(withActions('queryChange', 'fetchItems'))
  .add('Showcase', () => <ExampleApp />, { notes: { markdown: showcaseNotes } })
  .add(
    'Advanced Search container component',
    () => (
      <AdvancedSearch
        schema={null as any}
        onQueryChanged={action('queryChange')}
        fields={(options) => (
          <div>
            <button
              onClick={() =>
                options.updateQuery(
                  'example',
                  new Query((q) => q.equals('Index', parseInt((Math.random() * 100) as any, 10))),
                )
              }>
              Update Query
            </button>
          </div>
        )}
      />
    ),
    { notes: { markdown: advancedSearchNotes } },
  )
  .add(
    'Preset field',
    () => (
      <AdvancedSearch
        schema={null as any}
        fields={() => (
          <FormControl>
            <InputLabel>Created at</InputLabel>
            <PresetField
              fieldName="CreationDate"
              presets={[
                { text: '-', value: new Query((a) => a) },
                { text: 'Today', value: new Query((a) => a.term('CreationDate:>@@Today@@')) },
                {
                  text: 'Yesterday',
                  value: new Query((a) => a.term('CreationDate:>@@Yesterday@@').and.term('CreationDate:<@@Today@@')),
                },
              ]}
              onQueryChange={action('onQueryChange')}
              style={{ minWidth: '250px' }}
            />
          </FormControl>
        )}
      />
    ),
    { notes: { markdown: presetFieldNotes } },
  )
  .add(
    'Reference field',
    () => (
      <AdvancedSearch
        schema={null as any}
        onQueryChanged={action('queryChanged')}
        fields={() => (
          <ReferenceField<GenericContent>
            fieldName="CreatedBy"
            fieldSetting={{
              Name: 'Created By',
              Type: 'User',
              FieldClassName: '',
              AllowedTypes: ['User'],
            }}
            fetchItems={async (...args: any[]) => {
              action('fetchItems')(...args)
              await sleepAsync(300)
              return [
                {
                  Id: 1,
                  Name: 'Alba',
                  DisplayName: 'Alba Monday',
                  Path: 'Root/Alba',
                  Type: 'User',
                },
                {
                  Id: 2,
                  Name: 'BusinessCat',
                  DisplayName: 'Business Cat',
                  Path: 'Root/BusinessCat',
                  Type: 'User',
                },
              ]
            }}
            onQueryChange={action('onQueryChange')}
            helperText={'Type something to search'}
          />
        )}
      />
    ),
    { notes: { markdown: referenceFieldNotes } },
  )
  .add(
    'Text field',
    () => (
      <AdvancedSearch
        schema={null as any}
        onQueryChanged={action('queryChanged')}
        fields={() => (
          <TextField
            placeholder="Type something to filter...."
            fieldName="DisplayName"
            onQueryChange={action('onQueryChange')}
          />
        )}
      />
    ),
    { notes: { markdown: textFieldNotes } },
  )
  .add(
    'Nested Text field',
    () => (
      <AdvancedSearch
        schema={null as any}
        onQueryChanged={action('queryChanged')}
        fields={() => (
          <NestedTextField
            placeholder="Type something to filter...."
            fieldName="Owner"
            nestedFieldName="DisplayName"
            onQueryChange={action('onQueryChange')}
          />
        )}
      />
    ),
    { notes: { markdown: nestedTextFieldNotes } },
  )
  .add(
    'Type field',
    () => (
      <AdvancedSearch
        schema={null as any}
        onQueryChanged={action('queryChanged')}
        fields={() => (
          <TypeField
            placeholder="Select a content type"
            style={{ minWidth: '250px' }}
            schemaStore={new Repository().schemas}
            types={[User, Folder, PortalSettings]}
            onQueryChange={action('onQueryChange')}
          />
        )}
      />
    ),
    { notes: { markdown: typeFieldNotes } },
  )
