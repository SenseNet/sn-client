import { Repository } from '@sensenet/client-core'
import { BrowseView, EditView, NewView } from '@sensenet/controls-react/src'
import { File, VersioningMode } from '@sensenet/default-content-types'
import { withA11y } from '@storybook/addon-a11y'
import { object, text, withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import React from 'react'
import browseViewNotes from '../notes/viewcontrols/BrowseView.md'
import editViewNotes from '../notes/viewcontrols/EditView.md'
import newViewNotes from '../notes/viewcontrols/NewView.md'
import { customSchema } from './custom-schema'

export const testRepository = new Repository({
  repositoryUrl: 'https://dev.demo.sensenet.com',
  requiredSelect: ['Id', 'Path', 'Name', 'Type', 'ParentId', 'DisplayName'],
  schemas: customSchema,
})

export const testFile: File = {
  Id: 1,
  Name: 'Sample-document.docx',
  DisplayName: 'Sample-document.docx',
  Path: '/Root/Profiles/Public/alba/Document_Library/Sample-document.docx',
  Watermark: 'sensenet',
  Type: 'File',
  Index: 42,
  VersioningMode: [VersioningMode.Option0],
  AllowedChildTypes: [1, 2],
  Description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis nec iaculis lectus, sed blandit urna. Nullam in auctor odio, eu eleifend diam. Curabitur rutrum ullamcorper nunc, sit amet consectetur turpis elementum ac. Aenean lorem lorem, feugiat sit amet sem at, accumsan cursus leo.',
}

storiesOf('ViewControls', module)
  .addDecorator(withKnobs)
  .addDecorator(withA11y)
  .add(
    'new view',
    () => (
      <NewView
        repository={testRepository}
        contentTypeName="File"
        showTitle={true}
        extension={text('Extension', 'docx')}
      />
    ),
    { notes: { markdown: newViewNotes } },
  )
  .add(
    'edit view',
    () => <EditView content={object('Content', testFile)} contentTypeName={'File'} repository={testRepository} />,
    {
      notes: { markdown: editViewNotes },
    },
  )
  .add('browse view', () => <BrowseView content={object('Content', testFile)} repository={testRepository} />, {
    notes: { markdown: browseViewNotes },
  })
