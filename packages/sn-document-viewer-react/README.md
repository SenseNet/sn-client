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
  DocumentTitlePager,
  Download,
  LayoutAppBar,
  Print,
  RotateActivePagesWidget,
  RotateDocumentWidget,
  ROTATION_MODE,
  SaveWidget,
  Share,
  DocumentViewer as SnDocumentViewer,
  ToggleCommentsWidget,
  ToggleRedactionWidget,
  ToggleShapesWidget,
  ToggleThumbnailsWidget,
  ToggleWatermarkWidget,
  ZoomInOutWidget,
  ZoomModeWidget,
} from '@sensenet/document-viewer-react'

<SnDocumentViewer documentIdOrPath={<The document's Id or Path to preview>}>
  <LayoutAppBar>
    <ToggleThumbnailsWidget />
    <ZoomInOutWidget />
    <RotateActivePagesWidget mode={ROTATION_MODE.clockwise OR ROTATION_MODE.anticlockwise} />
    <RotateDocumentWidget mode={ROTATION_MODE.clockwise OR ROTATION_MODE.anticlockwise} />
    <DocumentTitlePager />
    <Download download={<function triggered on clicking download button>/>
    <Print print={function triggered on clicking print button/>
    <Share share={function triggered on clicking share button/>
    <SaveWidget /> --> this is under construction
    <ToggleRedactionWidget /> --> this is under construction
    <ToggleShapesWidget /> --> this is under construction
    <ToggleWatermarkWidget /> --> this is under construction
    <ZoomModeWidget />
    <ToggleCommentsWidget/>
  </LayoutAppBar>
</SnDocumentViewer>
```

The main component is SnDocumentViewer, but you can extend functionality with any widgets from the example
