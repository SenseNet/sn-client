import { FlatIcon, FontAwesomeIcon, Icon, ImageIcon, MaterialIcon } from '@sensenet/icons-react/src'
import { checkA11y } from '@storybook/addon-a11y'
import { action } from '@storybook/addon-actions'
import { withInfo } from '@storybook/addon-info'
import { select, text, withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import React from 'react'

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
    () => (
      <Icon
        iconName={text('Name of the icon', 'folder')}
        onClick={action('button-click')}
        color={select('Color', ['inherit', 'primary', 'secondary', 'action', 'error', 'disabled'], 'primary')}
        fontSize={select('Size', ['inherit', 'default'], 'default')}
        className={text('Additional class name', 'myClass')}
      />
    ),
    { notes: { markdown: defaultNotes } },
  )
  .add(
    'materialui',
    () => (
      <MaterialIcon
        iconName={text('Name of the icon', 'folder')}
        onClick={action('button-click')}
        color={select('Color', ['inherit', 'primary', 'secondary', 'action', 'error', 'disabled'], 'primary')}
        fontSize={select('Size', ['inherit', 'default'], 'default')}
        className={text('Additional class name', 'myClass')}
      />
    ),
    { notes: { markdown: materialuiNotes } },
  )
  .add(
    'fontawesome',
    () => (
      <FontAwesomeIcon
        iconName={text('Name of the icon', 'folder')}
        onClick={action('button-click')}
        color={select('Color', ['inherit', 'primary', 'secondary', 'action', 'error', 'disabled'], 'primary')}
        fontSize={select('Size', ['inherit', 'default'], 'default')}
      />
    ),
    { notes: { markdown: fontawesomeNotes } },
  )
  .add(
    'flaticon',
    () => (
      <FlatIcon
        iconName={text('Name of the icon', 'folder-symbol')}
        onClick={action('button-click')}
        color={select('Color', ['inherit', 'primary', 'secondary', 'action', 'error', 'disabled'], 'primary')}
        fontSize={select('Size', ['inherit', 'default'], 'default')}
      />
    ),
    { notes: { markdown: flaticonNotes } },
  )
  .add(
    'image',
    () => (
      <ImageIcon
        iconName={text('Name of the icon', 'folder')}
        onClick={action('button-click')}
        size={select('Size', [16, 32], 16)}
      />
    ),
    { notes: { markdown: imageNotes } },
  )
