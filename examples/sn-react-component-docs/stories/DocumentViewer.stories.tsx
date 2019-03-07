import { Comment, CreatedByUser } from '@sensenet/document-viewer-react/src/components/Comment'
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

storiesOf('DocumentViewer', module)
  .addDecorator(withKnobs)
  .addDecorator(story => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ flexBasis: '300px' }}>{story()}</div>
    </div>
  ))
  .add('a single comment with long text', () => (
    <Comment
      createdBy={object('Created by', createdBy)}
      id="a"
      localization={{} as any}
      text={text(
        'commentBody',
        `maros mester kis tanulóköréből Krisztián, Edgár és Böröndi Dani sikeresen letették a 480-as vizsgát! Gratulálunk nekik és köszönet marosnak a mentorálásért!
        A tanulókör készül a következő 486-os vizsgára. Cél az MCSD App Builder minősítés megszerzése, amelyhez a 486-os vizsga után már csak 1 vizsga kell.
        `,
      )}
    />
  ))
  .add('a single comment with short text', () => (
    <Comment
      createdBy={createdBy}
      id="a"
      localization={{} as any}
      text={text('commentBody', 'Lorem Ipsum is simply dummy text')}
    />
  ))
