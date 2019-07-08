import { storiesOf } from '@storybook/react'
import { ActionName } from '@sensenet/control-mapper'
import { withKnobs } from '@storybook/addon-knobs'

interface Options {
  component: (actionName: ActionName) => React.ReactElement
  markdown: string
  storyName: string
}

export function fieldControlStory({ component, markdown, storyName }: Options) {
  const stories = storiesOf(storyName, module).addDecorator(withKnobs)
  const actionNames: ActionName[] = ['new', 'edit', 'browse']
  actionNames.forEach(actionName =>
    stories.add(`${actionName} mode`, () => component(actionName), {
      notes: { markdown },
    }),
  )
}
