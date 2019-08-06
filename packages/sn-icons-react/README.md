# @sensenet/icons-react

> A React component rendering icons for sensenet supporting [material-ui](https://material.io/tools/icons/), [fontawesome](https://fontawesome.com/icons?d=gallery), [flaticon material-design](https://www.flaticon.com/packs/material-design) and sensenet 6 image icons.

[![NPM version](https://img.shields.io/npm/v/@sensenet/icons-react.svg?style=flat)](https://www.npmjs.com/package/@sensenet/icons-react)
[![NPM downloads](https://img.shields.io/npm/dt/@sensenet/icons-react.svg?style=flat)](https://www.npmjs.com/package/@sensenet/icons-react)
[![License: GPL v2](https://img.shields.io/badge/License-GPL%20v2-blue.svg)](https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html)

## Install

```bash
# Yarn
yarn add @sensenet/icons-react

# NPM
npm install @sensenet/icons-react
```

## Usage

There's a base component to handle the different icon types and an enum for the exact types that are supported. Import the base component and the enum to set which icon type you want to use. With no type param it fallbacks to material-ui as it is the default.

```ts
import { Icon } from '@sensenet/icons-react'

...
<Icon iconName="file">
...

```

### material-ui icons

Check [material-ui icons' page](https://material.io/tools/icons/?style=baseline) to get the name of the icon you need and set it as the `iconName` of the component. As optional parameters you can set `fontSize`, `color`, `classes`, `style`, `className` and you can add an eventHandler function to the `onClick` param which will called when the icon is clicked.

```ts
import { Icon, iconType } from '@sensenet/icons-react'

...
<Icon
    type={iconType.materialui}
    iconName="file"
    fontSize="default",
    color="primary"
    onClick={(e) => myEventHandler(e.target)}
    >
...

```

### FontAwesome icons

Check [FontAwesome icons' page](https://fontawesome.com/icons?d=gallery) to get the name of the icon you need and set it as the `iconName` of the component. As optional parameters you can set `fontSize`, `color`, `classes`, `style`, `className` and you can add an eventHandler function to the `onClick` param which will called when the icon is clicked.

```ts
import { Icon, iconType } from '@sensenet/icons-react'

...
<Icon
    type={iconType.fontawesome}
    iconName="file"
    fontSize="default",
    color="primary"
    onClick={(e) => myEventHandler(e.target)}
    >
...

```

### Flaticons material design icons

Check [Flaticon material-designs' icons' page](https://www.flaticon.com/packs/material-design) to get the name of the icon you need and set it as the `iconName` of the component. As optional parameters you can set `fontSize`, `color`, `classes`, `style`, `className` and you can add an eventHandler function to the `onClick` param which will called when the icon is clicked.

```ts
import { Icon, iconType } from '@sensenet/icons-react'

...
<Icon
    type={iconType.flaticon}
    iconName="file"
    fontSize="default",
    color="primary"
    onClick={(e) => myEventHandler(e.target)}
    >
...

```

### Old sensenet image icons

In the old versions of sensenet there was a naming convention to load images, so that you wanted to use the file icon, it was placed in a pre-defined place (/Root/Global/images/icons/{16|32|64}) with the name `file.png`. We moved the part of that logic into this new package with copying all the related icon images in almost the same structure. So if you want to use the old image icons use the Icon component the following way:

```ts
import { Icon, iconType } from '@sensenet/icons-react'

...
<Icon
    type={iconType.image}
    iconName="file"
    size={16},
    onClick={(e) => myEventHandler(e.target)}
    >
...

```

## Credits

Flaticon material-design icons made by [google](http://www.google.com) from [www.flaticon.com](http://www.flaticon.com)
