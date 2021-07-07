import { addons } from '@storybook/addons'
import '@storybook/addon-notes/register'
import '@storybook/addon-knobs/register'
import '@storybook/addon-actions/register'
import '@storybook/addon-links/register'
import '@storybook/addon-options/register'
import '@storybook/addon-a11y/register'
import '@storybook/addon-viewport/register'

addons.setConfig({
  sidebar: {
    showRoots: false,
  },
})
