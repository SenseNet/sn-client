import { addDecorator, configure } from '@storybook/react'
import { configureViewport, INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { withOptions } from '@storybook/addon-options'
import { setDefaults } from '@storybook/addon-info'

addDecorator(
  withOptions({
    name: 'sensenet React Component Docs',
    url: 'https://github.com/sensenet/sn-react-component-docs',
    hierarchySeparator: /\/|\./,
  }),
)

setDefaults({
  header: true,
  inline: false,
  source: true,
})

configureViewport({
  viewports: {
    ...INITIAL_VIEWPORTS,
  },
})

function loadStories() {
  require('./welcomeStory')
  const req = require.context('../stories', true, /\.stories\.tsx$/)
  req.keys().forEach(filename => req(filename))
}

configure(loadStories, module)
