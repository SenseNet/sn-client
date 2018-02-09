# sn-control-mapper

[![Gitter chat](https://img.shields.io/gitter/room/SenseNet/SN7ClientAPI.svg?style=flat)](https://gitter.im/SenseNet/SN7ClientAPI)
[![Build Status](https://travis-ci.org/SenseNet/sn-control-mapper.svg?branch=master)](https://travis-ci.org/SenseNet/sn-control-mapper)
[![codecov](https://codecov.io/gh/SenseNet/sn-control-mapper/branch/master/graph/badge.svg)](https://codecov.io/gh/SenseNet/sn-control-mapper)
[![Greenkeeper badge](https://badges.greenkeeper.io/SenseNet/sn-control-mapper.svg)](https://greenkeeper.io/)
[![NPM version](https://img.shields.io/npm/v/@sensenet/control-mapper.svg?style=flat)](https://www.npmjs.com/package/@sensenet/control-mapper)
[![NPM downloads](https://img.shields.io/npm/dt/@sensenet/control-mapper.svg?style=flat)](https://www.npmjs.com/package/@sensenet/control-mapper)
[![License](https://img.shields.io/github/license/SenseNet/sn-client-js.svg?style=flat)](https://github.com/sn-control-mapper/LICENSE.txt)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat)](http://commitizen.github.io/cz-cli/)

This NPM package contains a control mapping tool for sensenet ECM. This can be used for specifying relations between sensenet ECM schemas and specified UI controls at content and field level and can be used for automatized form generation.

Usage example:
```ts

import { Repository } from "@sensenet/client-core";
import { ControlMapper } from "@sensenet/control-mapper";

const repository = new Repository({ /** repository settings */});
const mapper = new ControlMapper(repository, 
                                 ExampleControlBase,
                                 (setting) => new ExampleClientSetting(setting),
                                 ExampleDefaultControl,
                                 ExampleDefaultFieldControl)
        .setupFieldSettingDefault(NumberFieldSetting, (setting) => MyNumberFieldImplementation)
        .setupFieldSettingDefault(PasswordFieldSetting, (setting) => MyPasswordFieldImplementation);
```
