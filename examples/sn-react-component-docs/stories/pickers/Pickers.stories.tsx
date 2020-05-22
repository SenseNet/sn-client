import React from 'react'
import { storiesOf } from '@storybook/react'
import showCaseAppNotes from '../../notes/pickers/ConnectedToDms.md'
import { ExampleApp, ExampleAppWithHook } from './ExampleApp'

storiesOf('ListPicker', module)
  .add('Connected to repository', () => <ExampleApp />, { showCaseAppNotes })
  .add('Example app with hook', () => <ExampleAppWithHook />)
