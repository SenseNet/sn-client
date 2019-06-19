import { FlatIcon, FontAwesomeIcon, Icon, ImageIcon, MaterialIcon } from '@sensenet/icons-react/src'
import { withA11y } from '@storybook/addon-a11y'
import { action } from '@storybook/addon-actions'
import { select, text, withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import React from 'react'

const stories = storiesOf('Icon', module)
  .addDecorator(withKnobs)
  .addDecorator(withA11y)

import defaultNotes from '../notes/icon/Default.md'
import materialuiNotes from '../notes/icon/Materialui.md'
import fontawesomeNotes from '../notes/icon/FontAwesome.md'
import flaticonNotes from '../notes/icon/Flaticon.md'
import imageNotes from '../notes/icon/Image.md'

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
