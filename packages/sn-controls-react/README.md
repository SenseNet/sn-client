# sn-controls-react
[![Greenkeeper badge](https://badges.greenkeeper.io/SenseNet/sn-controls-react.svg)](https://greenkeeper.io/)
[![Join the chat at https://gitter.im/SenseNet/sn-controls-react](https://badges.gitter.im/SenseNet/sn-controls-react.svg)](https://gitter.im/SenseNet/sn-controls-react?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![License](https://img.shields.io/github/license/SenseNet/sn-controls-react.svg?style=flat)](https://github.com/SenseNet/sn-controls-react/LICENSE.txt)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat)](http://commitizen.github.io/cz-cli/)

Collection of [React](https://facebook.github.io/react/) components for [sensenet](https://www.sensenet.com/) with [Material-UI](https://github.com/mui-org/material-ui)

[![Sense/Net Services](https://img.shields.io/badge/sensenet-7.0.0--beta3%20tested-green.svg)](https://github.com/SenseNet/sensenet/releases/tag/v7.0.0-beta3)

## Usage and installation

You can install the latest version from NPM

```
npm install --save sn-controls-react
```

You can import fieldcontrol and viewcontrol components into your React App the conventional way.

```ts

import { NewView, EditView, CommandButtons } 'sn-controls-react';

...

```

## View Controls

View Controls are almost the same as the .ascx [Content Views](http://wiki.sensenet.com/Content_View) in [sensenet Webpages](https://github.com/SenseNet/sn-webpages). This components define how the given Content will be rendered. As a Content is built up of Fields the View Control displays the Content using Field Controls to provide a surface to display/modify the Field values of the Content. View Control therefore depends on the Content Type of the specific Content.

### Content creation form (NewView)

```tsx
import { NewView } from 'sn-controls-react'
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
import { EditView } from 'sn-controls-react'
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
import { BrowseView } from 'sn-controls-react'

// content: Content | required  | empty Content Object

<BrowseView 
content={content} />
```

## Field Controls

Just as legacy controls in [sensenet Webpages](https://github.com/SenseNet/sn-webpages) Field Control components provide GUI for setting/modifying Field values of a Content but this time not as .ascx views but [React](https://facebook.github.io/react/) Components.
