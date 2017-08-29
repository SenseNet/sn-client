# sn-dms-demo

[![Join the chat at https://gitter.im/SenseNet/sn-dms-demo](https://badges.gitter.im/SenseNet/sn-dms-demo.svg)](https://gitter.im/SenseNet/sn-dms-demo?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Build Status](https://travis-ci.org/SenseNet/sn-dms-demo.svg?branch=master)](https://travis-ci.org/SenseNet/sn-dms-demo)
[![codecov](https://codecov.io/gh/SenseNet/sn-dms-demo/branch/master/graph/badge.svg)](https://codecov.io/gh/SenseNet/sn-dms-demo)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/708a03362ad447958a6830badfc61d80)](https://www.codacy.com/app/herflis33/sn-dms-demo?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=SenseNet/sn-dms-demo&amp;utm_campaign=Badge_Grade)
[![License](https://img.shields.io/github/license/SenseNet/sn-dms-demo.svg?style=flat)](https://github.com/SenseNet/sn-dms-demo/LICENSE.txt)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat)](http://commitizen.github.io/cz-cli/)
[![Greenkeeper badge](https://badges.greenkeeper.io/SenseNet/sn-dms-demo.svg)](https://greenkeeper.io/)

sensenet ECM Document Management demo with React.

[![Sense/Net Services](https://img.shields.io/badge/sensenet-7.0.0--beta3%20tested-green.svg)](https://github.com/SenseNet/sensenet/releases/tag/v7.0.0-beta3)

## Install and start

```
$ git clone https://github.com/SenseNet/sn-dms-demo.git
$ cd sn-dms-demo
$ npm install
$ npm start
```

Please set the following enviroment variables:
- REACT_APP_SERVICE_URL: url of the site that has at least [sensenet services](https://github.com/SenseNet/sensenet) installed (default value is ```https://sn-local``` so if you have a site installed locally with this url, you have nothing to do with this).
- REACT_APP_RECAPTCHA_KEY: [Google ReCAPTCHA](https://www.google.com/recaptcha/intro/) sitekey. Without this registration won't work.

## Running Tests

```
$ npm test
```

The app is built with [create-react-app-typescript](https://github.com/wmonk/create-react-app-typescript) the TypeScript version of [create-react-app](https://github.com/facebookincubator/create-react-app), so for further information about build, test, config, etc. issues, check them on github.