import React from 'react'
import { addDecorator, addParameters, configure } from '@storybook/react'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { Global, ThemeProvider, themes, createReset, convert } from '@storybook/theming'
import { withInfo } from '@storybook/addon-info'

addDecorator(
  withInfo({
    header: true,
    inline: false,
    source: true,
  }),
)

addDecorator((storyFn) => (
  <ThemeProvider theme={convert(themes.light)}>
    <Global styles={createReset} />
    {storyFn()}
  </ThemeProvider>
))

addParameters({
  options: {
    brandTitle: 'sensenet React Component Docs',
    brandUrl: 'https://github.com/sensenet/sn-react-component-docs',
    hierarchySeparator: /\/|\./,
  },
  viewports: {
    ...INITIAL_VIEWPORTS,
  },
})

function loadStories() {
  require('./welcomeStory')
  const req = require.context('../stories', true, /\.stories\.tsx$/)
  req.keys().forEach((filename) => req(filename))
}

configure(loadStories, module)
