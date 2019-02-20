import { addDecorator, addParameters, configure } from '@storybook/react'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { withInfo } from '@storybook/addon-info'

addDecorator(
  withInfo({
    header: true,
    inline: false,
    source: true,
  }),
)

addParameters({
  options: {
    name: 'sensenet React Component Docs',
    url: 'https://github.com/sensenet/sn-react-component-docs',
    hierarchySeparator: /\/|\./,
  },
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
