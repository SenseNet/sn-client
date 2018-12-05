import { FlatIcon, FontAwesomeIcon, Icon, ImageIcon, MaterialIcon } from '@sensenet/icons-react/src'
import { checkA11y } from '@storybook/addon-a11y'
import { action } from '@storybook/addon-actions'
import { withInfo } from '@storybook/addon-info'
import { select, text, withKnobs } from '@storybook/addon-knobs'
import { withMarkdownNotes } from '@storybook/addon-notes'
import { addDecorator, storiesOf } from '@storybook/react'
import React from 'react'
import { muiTheme } from 'storybook-addon-material-ui'

addDecorator(muiTheme())
const stories = storiesOf('Icon', module)
  .addDecorator(withKnobs)
  .addDecorator(withInfo())
  .addDecorator(checkA11y)

const defaultNotes = require('../notes/icon/Default.md')
const materialuiNotes = require('../notes/icon/Materialui.md')
const fontawesomeNotes = require('../notes/icon/FontAwesome.md')
const flaticonNotes = require('../notes/icon/Flaticon.md')
const imageNotes = require('../notes/icon/Image.md')

stories
  .add(
    'default',
    withMarkdownNotes(defaultNotes)(() => (
      <Icon
        iconName={text('Name of the icon', 'folder')}
        onClick={action('button-click')}
        color={select('Color', ['inherit', 'primary', 'secondary', 'action', 'error', 'disabled'], 'primary')}
        fontSize={select('Size', ['inherit', 'default'], 'default')}
        className={text('Additional class name', 'myClass')}
      />
    )),
  )
  .add(
    'materialui',
    withMarkdownNotes(materialuiNotes)(() => (
      <MaterialIcon
        iconName={text('Name of the icon', 'folder')}
        onClick={action('button-click')}
        color={select('Color', ['inherit', 'primary', 'secondary', 'action', 'error', 'disabled'], 'primary')}
        fontSize={select('Size', ['inherit', 'default'], 'default')}
        className={text('Additional class name', 'myClass')}
      />
    )),
  )
  .add(
    'fontawesome',
    withMarkdownNotes(fontawesomeNotes)(() => (
      <FontAwesomeIcon
        iconName={text('Name of the icon', 'folder')}
        onClick={action('button-click')}
        color={select('Color', ['inherit', 'primary', 'secondary', 'action', 'error', 'disabled'], 'primary')}
        fontSize={select('Size', ['inherit', 'default'], 'default')}
      />
    )),
  )
  .add(
    'flaticon',
    withMarkdownNotes(flaticonNotes)(() => (
      <FlatIcon
        iconName={text('Name of the icon', 'folder-symbol')}
        onClick={action('button-click')}
        color={select('Color', ['inherit', 'primary', 'secondary', 'action', 'error', 'disabled'], 'primary')}
        fontSize={select('Size', ['inherit', 'default'], 'default')}
      />
    )),
  )
  .add(
    'image',
    withMarkdownNotes(imageNotes)(() => (
      <ImageIcon
        iconName={text('Name of the icon', 'folder')}
        onClick={action('button-click')}
        size={select('Size', [16, 32], 16)}
      />
    )),
  )
