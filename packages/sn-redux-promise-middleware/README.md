# sn-redux-promise-middleware

[![Build Status](https://travis-ci.org/SenseNet/sn-redux-promise-middleware.svg?branch=master)](https://travis-ci.org/SenseNet/sn-redux-promise-middleware)
[![codecov](https://codecov.io/gh/SenseNet/sn-redux-promise-middleware/branch/master/graph/badge.svg)](https://codecov.io/gh/SenseNet/sn-redux-promise-middleware)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/e5b6b7367de74af38c153a59d88d56cb)](https://www.codacy.com/app/SenseNet/sn-redux-promise-middleware?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=SenseNet/sn-redux-promise-middleware&amp;utm_campaign=Badge_Grade)
[![License](https://img.shields.io/github/license/SenseNet/sn-redux-promise-middleware.svg?style=flat)](https://github.com/SenseNet/sn-redux-promise-middleware/LICENSE.txt)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat)](http://commitizen.github.io/cz-cli/)

sensenet's redux promise middleware enables handling of async actions in Redux based on [Redux Promise Middleware](https://github.com/pburtchaell/redux-promise-middleware). This middleware is a custom implementation of the mentioned one so install, include and use it the same way except that: 
- it needs a ```repository``` as an input param, so that sensenet repository and the related API can be used inside Actions,
- it does not have a customizable config
    - Action suffixes are hardcoded (LOADING, SUCCESS, FAILURE)
    - Action delimiter is hardcoded '_'

## Install

``` npm i redux-promise-middleware -s ```

## Setup

``` Typescript
import { Repository } from '@sensenet/client-core'
import promiseMiddleware from '@sensenet/redux-promise-middleware'

const repository = new Repository({ repositoryUrl: 'https://mySensenetSite.com' }, async () => ({ ok: true } as any))

...

const store = createStore(
    rootReducer,
    persistedState,
    applyMiddleware([promiseMiddleware(repository)]),
)
```

## Use

About how to use it with Actions check [sn-redux](https://github.com/SenseNet/sn-redux) docs.