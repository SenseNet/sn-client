import { ActionName } from '@sensenet/control-mapper'
import { withA11y } from '@storybook/addon-a11y'
import { withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'

interface Options {
  component: (actionName: ActionName) => React.ReactElement
  markdown: string
  storyName: string
}

export function fieldControlStory({ component, markdown, storyName }: Options) {
  const stories = storiesOf(storyName, module).addDecorator(withKnobs).addDecorator(withA11y)
  const actionNames: ActionName[] = ['new', 'edit', 'browse']
  actionNames.forEach((actionName) =>
    stories.add(`${actionName} mode`, () => component(actionName), {
      notes: { markdown },
    }),
  )
}
