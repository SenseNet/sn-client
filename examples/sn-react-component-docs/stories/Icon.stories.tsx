import React from "react";
import { storiesOf, addDecorator } from "@storybook/react";
import { Icon, FontAwesomeIcon, FlatIcon, ImageIcon, MaterialIcon } from "@sensenet/icons-react/src";
import { muiTheme } from 'storybook-addon-material-ui';
import { action } from '@storybook/addon-actions';
import { withKnobs, text, select } from '@storybook/addon-knobs';
import { withMarkdownNotes } from '@storybook/addon-notes';
import { withInfo } from "@storybook/addon-info";
import { checkA11y } from '@storybook/addon-a11y'

addDecorator(muiTheme())
const stories = storiesOf("Icon", module).addDecorator(withKnobs).addDecorator(withInfo()).addDecorator(checkA11y);


const defaultNotes = require('../notes/icon/Default.md')
const materialuiNotes = require('../notes/icon/Materialui.md')
const fontawesomeNotes = require('../notes/icon/FontAwesome.md')
const flaticonNotes = require('../notes/icon/Flaticon.md')
const imageNotes = require('../notes/icon/Image.md')

stories.add(
    "default", withMarkdownNotes(defaultNotes)
        (() => (
            <Icon
                iconName={text('Name of the icon', 'folder')}
                onClick={action('button-click')}
                color={select('Color', ["inherit", "primary", "secondary", "action", "error", "disabled"], 'primary')}
                fontSize={select('Size', ['inherit', 'default'], 'default')}
                className={text('Additional class name', 'myClass')}
            />
        )),
).add(
    "materialui", withMarkdownNotes(materialuiNotes)
        (() => (
            <MaterialIcon
                iconName={text('Name of the icon', 'folder')}
                onClick={action('button-click')}
                color={select('Color', ["inherit", "primary", "secondary", "action", "error", "disabled"], 'primary')}
                fontSize={select('Size', ['inherit', 'default'], 'default')}
                className={text('Additional class name', 'myClass')}
            />
        )),
).add(
    "fontawesome", withMarkdownNotes(fontawesomeNotes)
        (() => (
            <FontAwesomeIcon
                iconName={text('Name of the icon', 'folder')}
                onClick={action('button-click')}
                color={select('Color', ["inherit", "primary", "secondary", "action", "error", "disabled"], 'primary')}
                fontSize={select('Size', ['inherit', 'default'], 'default')}
            />
        )),
).add(
    "flaticon", withMarkdownNotes(flaticonNotes)
        (() => (
            <FlatIcon
                iconName={text('Name of the icon', 'folder-symbol')}
                onClick={action('button-click')}
                color={select('Color', ["inherit", "primary", "secondary", "action", "error", "disabled"], 'primary')}
                fontSize={select('Size', ['inherit', 'default'], 'default')}
            />
        )),
).add(
    "image", withMarkdownNotes(imageNotes)
        (() => (
            <ImageIcon
                iconName={text('Name of the icon', 'folder')}
                onClick={action('button-click')}
                size={select('Size', [16, 32], 16)}
            />
        )),
);

