import { FormControl, InputLabel } from '@material-ui/core'
import { Repository } from '@sensenet/client-core'
import { sleepAsync } from '@sensenet/client-utils'
import { Folder, PortalSettings, User } from '@sensenet/default-content-types'
import { GenericContent } from '@sensenet/default-content-types/src'
import { Query } from '@sensenet/query'
import { AdvancedSearch, PresetField, ReferenceField, TextField, TypeField } from '@sensenet/search-react/src'
import { ExampleApp } from '@sensenet/search-react/src/ExampleApp'
import { checkA11y } from '@storybook/addon-a11y'
import { action } from '@storybook/addon-actions'
import { withActions } from '@storybook/addon-actions/dist/preview'
import { withInfo } from '@storybook/addon-info'
import { withKnobs } from '@storybook/addon-knobs'
import { withMarkdownNotes } from '@storybook/addon-notes'
import { addDecorator, storiesOf } from '@storybook/react'
import React from 'react'
import { muiTheme } from 'storybook-addon-material-ui'

addDecorator(muiTheme())

const showcaseNotes = require('../notes/search/Showcase.md')

const advancedSearchNotes = require('../notes/search/AdvancedSearch.md')
const presetFieldNotes = require('../notes/search/PresetField.md')
const referenceFieldNotes = require('../notes/search/ReferenceField.md')
const textFieldNotes = require('../notes/search/TextField.md')
const typeFieldNotes = require('../notes/search/TypeField.md')

storiesOf('Search', module)
  .addDecorator(withKnobs)
  .addDecorator(withInfo())
  .addDecorator(checkA11y)
  .addDecorator(withActions('queryChange', 'fetchItems'))
  .add('Showcase', withMarkdownNotes(showcaseNotes)(() => <ExampleApp />))
  .add(
    'Advanced Search container component',
    withMarkdownNotes(advancedSearchNotes)(() => (
      <AdvancedSearch
        schema={null}
        onQueryChanged={action('queryChange')}
        fields={options => (
          <div>
            <button
              onClick={() =>
                options.updateQuery(
                  'example',
                  new Query(q => q.equals('Index', parseInt((Math.random() * 100) as any, 10))),
                )
              }>
              Update Query
            </button>
          </div>
        )}
      />
    )),
  )
  .add(
    'Preset field',
    withMarkdownNotes(presetFieldNotes)(() => (
      <AdvancedSearch
        schema={null as any}
        fields={() => (
          <FormControl>
            <InputLabel>Created at</InputLabel>
            <PresetField
              fieldName="CreationDate"
              presets={[
                { text: '-', value: new Query(a => a) },
                { text: 'Today', value: new Query(a => a.term('CreationDate:>@@Today@@')) },
                {
                  text: 'Yesterday',
                  value: new Query(a => a.term('CreationDate:>@@Yesterday@@').and.term('CreationDate:<@@Today@@')),
                },
              ]}
              onQueryChange={action('onQueryChange')}
              style={{ minWidth: '250px' }}
            />
          </FormControl>
        )}
      />
    )),
  )
  .add(
    'Reference field',
    withMarkdownNotes(referenceFieldNotes)(() => (
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
            id="reference-filter"
          />
        )}
      />
    )),
  )
  .add(
    'Text field',
    withMarkdownNotes(textFieldNotes)(() => (
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
    )),
  )
  .add(
    'Type field',
    withMarkdownNotes(typeFieldNotes)(() => (
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
    )),
  )
