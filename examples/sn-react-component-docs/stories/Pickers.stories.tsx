import { App } from '@sensenet/pickers-react/src/ExampleApp'
import { withInfo } from '@storybook/addon-info'
import { storiesOf } from '@storybook/react'
import React from 'react'

storiesOf('ListPicker', module)
  .addDecorator(withInfo())
  .add('Connected to repository', () => <App />)
