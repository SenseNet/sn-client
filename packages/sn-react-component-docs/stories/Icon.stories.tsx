import React from "react";
import { storiesOf, addDecorator } from "@storybook/react";
import { Icon, iconType } from "../src/components/icons-react/components/Icon";
import { muiTheme } from 'storybook-addon-material-ui';
import { action } from '@storybook/addon-actions';
import { withKnobs, text, select } from '@storybook/addon-knobs';
import { withNotes } from '@storybook/addon-notes';
import { withInfo } from "@storybook/addon-info";

addDecorator(muiTheme())
const stories = storiesOf("Icon", module).addDecorator(withKnobs).addDecorator(withInfo());

stories.add(
    "default", withNotes('A very simple component to display icons with various icon libs.')
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
    "fontawesome",
    (() => (
        <Icon
            type={iconType.fontawesome}
            iconName={text('Name of the icon', 'folder')}
            onClick={action('button-click')}
            color={select('Color', ["inherit", "primary", "secondary", "action", "error", "disabled"], 'primary')}
            fontSize={select('Size', ['inherit', 'default'], 'default')}
            className={text('Additional class name', 'myClass')}
        />
    )),
).add(
    "flaticon",
    (() => (
        <Icon
            type={iconType.flaticon}
            iconName={text('Name of the icon', 'folder-symbol')}
            onClick={action('button-click')}
            color={select('Color', ["inherit", "primary", "secondary", "action", "error", "disabled"], 'primary')}
            fontSize={select('Size', ['inherit', 'default'], 'default')}
            className={text('Additional class name', 'myClass')}
        />
    )),
).add(
    "image",
    (() => (
        <Icon
            type={iconType.image}
            iconName={text('Name of the icon', 'folder')}
            onClick={action('button-click')}
            size={select('Size', [16, 32], 16)}
            className={text('Additional class name', 'myClass')}
        />
    )),
);

