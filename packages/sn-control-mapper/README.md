# @sensenet/control-mapper

> This NPM package contains a control mapping tool for sensenet. This can be used for specifying relations between sensenet schemas and specified UI controls at content and field level and can be used for automatized form generation.

[![NPM version](https://img.shields.io/npm/v/@sensenet/control-mapper.svg?style=flat)](https://www.npmjs.com/package/@sensenet/control-mapper)
[![NPM downloads](https://img.shields.io/npm/dt/@sensenet/control-mapper.svg?style=flat)](https://www.npmjs.com/package/@sensenet/control-mapper)
[![License: GPL v2](https://img.shields.io/badge/License-GPL%20v2-blue.svg)](https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html)

## Install

```bash
# Yarn
yarn add @sensenet/control-mapper

# NPM
npm install @sensenet/control-mapper
```

## Usage

```ts
import { Repository } from '@sensenet/client-core'
import { ControlMapper } from '@sensenet/control-mapper'

const repository = new Repository({
  /** repository settings */
})

const mapper = new ControlMapper(repository, ExampleDefaultControl, ExampleDefaultFieldControl)
  .setupFieldSettingDefault('NumberFieldSetting', setting => MyNumberFieldImplementation)
  .setupFieldSettingDefault('PasswordFieldSetting', setting => MyPasswordFieldImplementation)
```
