import { Comment } from '@sensenet/document-viewer-react/src/components/Comment'
import { text, withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import React from 'react'

storiesOf('DocumentViewer', module)
  .addDecorator(withKnobs)
  .addDecorator(story => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ flexBasis: '300px' }}>{story()}</div>
    </div>
  ))
  .add('a single comment with long text', () => (
    <Comment
      displayName={text('displayName', 'maros')}
      avatarUrl="https://www.sensenet.com/binaryhandler.ashx?nodeid=8591&propertyname=ImageData&checksum=1763589"
      commentBody={text(
        'commentBody',
        `maros mester kis tanulóköréből Krisztián, Edgár és Böröndi Dani sikeresen letették a 480-as vizsgát! Gratulálunk nekik és köszönet marosnak a mentorálásért!
        A tanulókör készül a következő 486-os vizsgára. Cél az MCSD App Builder minősítés megszerzése, amelyhez a 486-os vizsga után már csak 1 vizsga kell.
        `,
      )}
    />
  ))
  .add('a single comment with short text', () => (
    <Comment
      displayName={text('displayName', 'maros')}
      avatarUrl="https://www.sensenet.com/binaryhandler.ashx?nodeid=8591&propertyname=ImageData&checksum=1763589"
      commentBody={text('commentBody', 'Lorem Ipsum is simply dummy text')}
    />
  ))
