import React from "react";
import { addDecorator, configure, setAddon } from "@storybook/react";
import { muiTheme } from 'storybook-addon-material-ui'
import { configureViewport, INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { setOptions, withOptions } from '@storybook/addon-options';
import { setDefaults } from '@storybook/addon-info';

setOptions({
  name: 'sensenet React Component Docs',
  url: 'https://github.com/sensenet/sn-react-component-docs',
  hierarchySeparator: /\/|\./,
})

setDefaults({
  header: true,
  inline: false,
  source: true,
})

setAddon(muiTheme)

configureViewport({
  viewports: {
    ...INITIAL_VIEWPORTS,
  },
});

// automatically import all files ending in *.stories.js
const req = require.context("../stories", true, /.stories.tsx$/);
function loadStories() {
  addDecorator(muiTheme())
  require('./welcomeStory')
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
