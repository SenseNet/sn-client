import { UniversalHeader } from '@sensenet/universal-header-react'
import { withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import React from 'react'
import universalHeaderNotes from '../notes/universal-header/UniversalHeader.md'

storiesOf('Universal components', module)
  .addDecorator(withKnobs)
  .add(
    'Universal header',
    () => (
      <UniversalHeader
        title="Universal header"
        threeDotMenuItems={
          <>
            <div style={{ padding: '6px 16px ' }}>Example menu item</div>
            <div style={{ padding: '6px 16px' }}>Another example menu item</div>
          </>
        }
      />
    ),
    {
      notes: { markdown: universalHeaderNotes },
    },
  )
