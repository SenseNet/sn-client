import { storiesOf } from '@storybook/react'
import React from 'react'
import showCaseAppNotes from '../../notes/pickers/ConnectedToDms.md'
import { ExampleApp } from './ExampleApp'

storiesOf('ListPicker', module).add('Connected to repository', () => <ExampleApp />, { showCaseAppNotes })
