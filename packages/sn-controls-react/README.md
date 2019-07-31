# @sensenet/controls-react

> Collection of [React](https://facebook.github.io/react/) components for [sensenet](https://www.sensenet.com/) with [Material-UI](https://github.com/mui-org/material-ui)

[![Sense/Net Services](https://img.shields.io/badge/sensenet-7.0.0--beta3%20tested-green.svg)](https://github.com/SenseNet/sensenet/releases/tag/v7.0.0-beta3)
[![NPM version](https://img.shields.io/npm/v/@sensenet/controls-react.svg?style=flat)](https://www.npmjs.com/package/@sensenet/controls-react)
[![NPM downloads](https://img.shields.io/npm/dt/@sensenet/controls-react.svg?style=flat)](https://www.npmjs.com/package/@sensenet/controls-react)
[![License: GPL v2](https://img.shields.io/badge/License-GPL%20v2-blue.svg)](https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html)

## Install

```bash
# Yarn
yarn add @sensenet/controls-react

# NPM
npm install @sensenet/controls-react
```

## Usage

You can import fieldcontrol and viewcontrol components into your React App the conventional way.

```ts

import { NewView, EditView, CommandButtons } '@sensenet/controls-react';

...

```

## View Controls

View Controls are almost the same as the .ascx [Content Views](http://wiki.sensenet.com/Content_View) in [sensenet Webpages](https://github.com/SenseNet/sn-webpages). This components define how the given Content will be rendered. As a Content is built up of Fields the View Control displays the Content using Field Controls to provide a surface to display/modify the Field values of the Content. View Control therefore depends on the Content Type of the specific Content.

### Content creation form (NewView)

```tsx
import { NewView } from '@sensenet/controls-react'
import createBrowserHistory from 'history/createBrowserHistory'
const history = createBrowserHistory()

// content: Content | required  | empty Content Object
// history: history Object made with createBrowserHistory() | optional | called after submit | default: window.history.back()
// onSubmit: Function | optional | called on submit event | default: window.history.back()

<NewView
content={content}
history={history}
onSubmit={() => {})} />
```

### Content editor form (EditView)

```tsx
import { EditView } from '@sensenet/controls-react'
import createBrowserHistory from 'history/createBrowserHistory'
const history = createBrowserHistory()

// content: Content | required  | empty Content Object
// history: history Object made with createBrowserHistory() | optional | called after submit | default: window.history.back()
// onSubmit: Function | optional | called on submit event | default: window.history.back()

<EditView
content={content}
history={history}
onSubmit={() => {})} />
```

### Content browse view (BrowseView)

```tsx
import { BrowseView } from '@sensenet/controls-react'

// content: Content | required  | empty Content Object
;<BrowseView content={content} />
```

## Field Controls

Just as legacy controls in [sensenet Webpages](https://github.com/SenseNet/sn-webpages) Field Control components provide GUI for setting/modifying Field values of a Content but this time not as .ascx views but [React](https://facebook.github.io/react/) Components.
