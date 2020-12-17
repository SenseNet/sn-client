# @sensenet/document-viewer-react

> Document viewer component for sensenet

[![NPM version](https://img.shields.io/npm/v/@sensenet/document-viewer-react.svg?style=flat)](https://www.npmjs.com/package/@sensenet/document-viewer-react)
[![NPM downloads](https://img.shields.io/npm/dt/@sensenet/document-viewer-react.svg?style=flat)](https://www.npmjs.com/package/@sensenet/document-viewer-react)
[![License: GPL v2](https://img.shields.io/badge/License-GPL%20v2-blue.svg)](https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html)

## Install

```bash
# Yarn
yarn add @sensenet/document-viewer-react

# NPM
npm install @sensenet/document-viewer-react
```

## Usage

```
import {
  AddAnnotationWidget,
  AddHighlightWidget,
  AddRedactionWidget,
  DocumentTitlePager,
  LayoutAppBar,
  RotateActivePagesWidget,
  RotateDocumentWidget,
  ROTATION_MODE,
  SaveWidget,
  DocumentViewer as SnDocumentViewer,
  ToggleCommentsWidget,
  ToggleRedactionWidget,
  ToggleShapesWidget,
  ToggleThumbnailsWidget,
  ZoomInOutWidget,
} from '@sensenet/document-viewer-react'

<SnDocumentViewer
  documentIdOrPath={<an id or path of the document>}
  renderAppBar={() => (
    <LayoutAppBar>
      <div style={{ flexShrink: 0 }}>
        <ToggleThumbnailsWidget />
        <ZoomInOutWidget />
        <RotateActivePagesWidget mode={ROTATION_MODE.clockwise} />
        <RotateDocumentWidget mode={ROTATION_MODE.clockwise} />
        <SaveWidget />
      </div>
      <DocumentTitlePager />
      <div style={{ flexShrink: 0 }}>
        <ToggleRedactionWidget />
        <ToggleShapesWidget />
        <AddRedactionWidget />
        <AddHighlightWidget />
        <AddAnnotationWidget />
        <ToggleCommentsWidget />
      </div>
    </LayoutAppBar>
  )}
/>
```

The main component is SnDocumentViewer, but you can extend functionality with any widgets from the example
