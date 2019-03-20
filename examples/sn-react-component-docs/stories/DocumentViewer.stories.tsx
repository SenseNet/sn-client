import { ViewerExampleApp } from '@sensenet/document-viewer-react/example/example'
import { CommentComponent } from '@sensenet/document-viewer-react/src/components'
import { CreatedByUser } from '@sensenet/document-viewer-react/src/models'
import { defaultLocalization } from '@sensenet/document-viewer-react/src/store/Localization'
import { action } from '@storybook/addon-actions'
import { object, text, withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import React from 'react'

const createdBy: CreatedByUser = {
  avatarUrl: 'https://cdn.images.express.co.uk/img/dynamic/79/590x/486693_1.jpg',
  displayName: 'Alba',
  id: 1,
  path: 'some/path',
  userName: 'some/name',
}

const centered = story => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <div style={{ flexBasis: '300px' }}>{story()}</div>
  </div>
)

storiesOf('DocumentViewer', module)
  .addDecorator(withKnobs)
  .add('showcase app', () => <ViewerExampleApp />, { info: { disable: true }, options: { showAddonPanel: false } })
  .add(
    'a single comment with long text',
    () => (
      <CommentComponent
        createdBy={object('Created by', createdBy)}
        page={1}
        x={10}
        y={10}
        deleteComment={action('delete')}
        id={text('id', 'randomId')}
        localization={defaultLocalization}
        text={text(
          'commentBody',
          `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Nulla dictum ut lacus et gravida.
          Mauris elementum urna nec mi facilisis, non vulputate libero luctus.
          Praesent est turpis, dictum sed auctor id, pulvinar id neque.
        `,
        )}
      />
    ),
    { decorators: [centered] },
  )
  .add(
    'a single comment with short text',
    () => (
      <CommentComponent
        createdBy={createdBy}
        page={1}
        x={10}
        y={10}
        deleteComment={action('delete')}
        id={text('id', 'randomId')}
        localization={defaultLocalization}
        text={text('commentBody', 'Lorem Ipsum is simply dummy text')}
      />
    ),
    { decorators: [centered] },
  )
