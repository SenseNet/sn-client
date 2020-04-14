import { ContentList, VirtualizedTable } from '@sensenet/list-controls-react/src/ContentList'
import { withA11y } from '@storybook/addon-a11y'
import { action } from '@storybook/addon-actions'
import { array, boolean, select, text, withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import React from 'react'
import { ActionModel, GenericContent } from '@sensenet/default-content-types'
import { Paper } from '@material-ui/core'
import contentListNotes from '../../notes/listcontrols/ContentList.md'
import virtualizedTableNotes from '../../notes/listcontrols/VirtualizedTable.md'
import { icons } from '../../assets/icons'
import { customSchema } from '../custom-schema'

const orderDirectionOptions = {
  asc: 'asc',
  desc: 'desc',
}

const items: GenericContent[] = [
  {
    DisplayName: 'Sample folder',
    Name: 'SampleFolder',
    Locked: true,
    ModificationDate: '2018-11-05T00:44:55.767Z',
    Actions: [
      {
        DisplayName: 'Rename',
        Icon: 'rename',
        Name: 'Rename',
      },
      {
        DisplayName: 'Delete',
        Icon: 'delete',
        Name: 'Delete',
      },
    ] as ActionModel[],
    Id: 1,
    Path: '/Root/Profiles/Public/alba/Document_Library/Sample-folder',
    Type: 'Folder',
    Icon: 'folder',
  },
  {
    DisplayName: 'Sample-document.docx',
    Name: 'Sample-document.docx',
    Locked: false,
    ModificationDate: '2018-11-05T00:44:55.843Z',
    Actions: [
      {
        DisplayName: 'Preview',
        Icon: 'preview',
        Name: 'Preview',
      },
      {
        DisplayName: 'Download',
        Icon: 'download',
        Name: 'Browse',
      },
      {
        DisplayName: 'Delete',
        Icon: 'delete',
        Name: 'Delete',
      },
    ] as ActionModel[],
    Id: 2,
    Path: '/Root/Profiles/Public/alba/Document_Library/Sample-document.docx',
    Type: 'File',
    Icon: 'word',
  },
]

type Sample = [string, string, boolean, string, ActionModel[], string, string, string]

const sample: Sample[] = [
  [
    'Sample folder',
    'SampleFolder',
    true,
    '2018-11-05T00:44:55.767Z',
    [
      {
        DisplayName: 'Rename',
        Icon: 'rename',
        Name: 'Rename',
      },
      {
        DisplayName: 'Delete',
        Icon: 'delete',
        Name: 'Delete',
      },
    ] as ActionModel[],
    'Folder',
    'folder',
    '/Root/Profiles/Public/alba/Document_Library/Sample-folder',
  ],
  [
    'Sample-document.docx',
    'SampleDocument',
    true,
    '2018-11-05T00:44:55.843Z',
    [
      {
        DisplayName: 'Rename',
        Icon: 'rename',
        Name: 'Rename',
      },
      {
        DisplayName: 'Delete',
        Icon: 'delete',
        Name: 'Delete',
      },
    ] as ActionModel[],
    'File',
    'word',
    '/Root/Profiles/Public/alba/Document_Library/Sample-document.docx',
  ],
  [
    'Sample-imageLibrary',
    'SampleImageLibrary',
    false,
    '2019-11-05T00:44:55.843Z',
    [
      {
        DisplayName: 'Rename',
        Icon: 'rename',
        Name: 'Rename',
      },
      {
        DisplayName: 'Delete',
        Icon: 'delete',
        Name: 'Delete',
      },
    ] as ActionModel[],
    'ImageLibrary',
    'image',
    '/Root/Profiles/Public/alba/Document_Library/Sample-imageLibrary',
  ],
  [
    'Sample-demoWorkspace',
    'SampleDemoWorkspace',
    false,
    '2019-11-05T00:44:55.843Z',
    [
      {
        DisplayName: 'Rename',
        Icon: 'rename',
        Name: 'Rename',
      },
      {
        DisplayName: 'Delete',
        Icon: 'delete',
        Name: 'Delete',
      },
    ] as ActionModel[],
    'DemoWorkspace',
    'copy',
    '/Root/Profiles/Public/alba/Document_Library/Sample-demoWorkspace',
  ],
  [
    'Sample-eventList',
    'SampleEventList',
    false,
    '2019-10-02T00:44:55.843Z',
    [
      {
        DisplayName: 'Rename',
        Icon: 'rename',
        Name: 'Rename',
      },
      {
        DisplayName: 'Delete',
        Icon: 'delete',
        Name: 'Delete',
      },
    ] as ActionModel[],
    'EventList',
    'document',
    '/Root/Profiles/Public/alba/Document_Library/Sample-eventList',
  ],
]

function createData(
  Id: number,
  Name: string,
  DisplayName: string,
  Locked: boolean,
  ModificationDate: string,
  Actions: ActionModel[],
  Type: string,
  Icon: string,
  Path: string,
): GenericContent {
  return { Id, Name, DisplayName, Locked, ModificationDate, Actions, Type, Icon, Path }
}

const rows: GenericContent[] = []

for (let i = 0; i < 200; i += 1) {
  const selection = sample[Math.floor(Math.random() * sample.length)]
  rows.push(createData(i, ...selection))
}

storiesOf('ListControls', module)
  .addDecorator(withKnobs)
  .addDecorator(withA11y)
  .add(
    'ContentList',
    () => (
      <ContentList
        items={items}
        schema={customSchema.find((s) => s.ContentTypeName === 'GenericContent')!}
        icons={icons}
        fieldsToDisplay={
          array('Fields to display', ['DisplayName', 'Locked', 'ModificationDate', 'Actions']) as Array<
            keyof GenericContent
          >
        }
        orderBy={text('Order by', 'DisplayName') as keyof GenericContent}
        orderDirection={select('Order direction', orderDirectionOptions, 'asc') as 'asc' | 'desc'}
        displayRowCheckbox={boolean('Display checkbox for selection', true)}
        onItemClick={action('item clicked')}
        onItemDoubleClick={action('item double-clicked')}
        onItemTap={action('item tapped')}
        onItemContextMenu={action('item right-clicked')}
        onRequestActionsMenu={action('actionmenu-button clicked')}
        onRequestOrderChange={action('ordering is changed')}
        onRequestSelectionChange={action('selection is changed')}
        onRequestActiveItemChange={action('active item is changed')}
        onAction={action('an action is requested')}
      />
    ),
    { notes: { markdown: contentListNotes } },
  )
  .add(
    'VirtualizedTable',
    () => (
      <Paper style={{ height: 400, width: '100%' }}>
        <VirtualizedTable
          fieldsToDisplay={['DisplayName', 'Locked', 'ModificationDate', 'Actions']}
          icons={icons}
          items={rows}
          displayRowCheckbox={true}
          schema={customSchema.find((s) => s.ContentTypeName === 'GenericContent')!}
          selected={null as any}
          tableProps={{
            rowCount: rows.length,
            rowHeight: 57,
            headerHeight: 42,
            rowGetter: ({ index }) => rows[index],
          }}
        />
      </Paper>
    ),
    { notes: { markdown: virtualizedTableNotes } },
  )
