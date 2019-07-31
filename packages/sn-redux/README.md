# @sensenet/redux

> sn-redux is a convention driven way of building sensenet applications using Redux. It contains all the action types, actions and reducers for [built-in sensenet Actions and Functions](https://community.sensenet.com/docs/built-in-odata-actions-and-functions/).

[![NPM version](https://img.shields.io/npm/v/@sensenet/redux.svg?style=flat)](https://www.npmjs.com/package/@sensenet/redux)
[![NPM downloads](https://img.shields.io/npm/dt/@sensenet/redux.svg?style=flat)](https://www.npmjs.com/package/@sensenet/redux)
[![License: GPL v2](https://img.shields.io/badge/License-GPL%20v2-blue.svg)](https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html)

## Install

```bash
# Yarn
yarn add @sensenet/redux

# NPM
npm install @sensenet/redux
```

sn-redux gives you a standard set of:

- action types: e.g. CREATE_CONTENT_SUCCESS
- actions: e.g. updateContentSuccess, updateContentFailure
- reducers: for the action types above e.g. updateContentSuccess

> Tested with the following sensenet Services version:
>
> [![sensenet Services](https://img.shields.io/badge/sensenet-7.1.3%20tested-green.svg)](https://github.com/SenseNet/sensenet/releases/tag/v7.0.0)

## Installation on an existing sensenet portal

Get the latest stable version with npm

```
npm install --save @sensenet/redux
```

or from the [GitHub repository](https://github.com/SenseNet/sn-redux) and place the downloaded source into your project. If you want to use only the transpiled

If you want to use the module types you can find them in the src folder. Import them the following way:

```
import { Actions } from '@sensenet/redux';
import { Repository } '@sensenet/client-core';
import { Task } from '@sensenet/default-content-types';

const repository = new Repository({
  RepositoryUrl: 'http://path-to-your-portal.com',
});

const repository = new Repository({
  repositoryUrl: 'http://path-to-your-portal.com',
})

store.dispatch(Actions.deleteContent('/workspaces/MyWorkspace/MyDocs/mydoc.docx', false));
```

## Installation into an external app with node and npm

To install the latest stable version

```
npm install --save @sensenet/redux
```

Create your sensenet portal Repository to use. You can configure your Store to use this repository, when calling Store.ConfigureStore

```ts
import { Repository } from '@sensenet/client-core'
import { Reducers, Store } from '@sensenet/redux'
import { combineReducers } from 'redux'

const sensenet = Reducers.sensenet

const myReducer = combineReducers({
  sensenet,
})

const repository = new Repository({
  repositoryUrl: 'http://path-to-your-portal.com',
})

const options = {
  repository,
  rootReducer: myReducer,
} as Store.CreateStoreOptions

const store = Store.createSensenetStore(options)
```

To enable your external app to send request against your sensenet portal change your `Portal.settings`. For further information about cross-origin resource sharing in sensenet check [this](http://wiki.sensenet.com/Cross-origin_resource_sharing#Origin_check) article.

Check your sensenet portal's web.config and if the `ODataServiceToken` is set, you can pass to your Repository as a config value on client side.

```ts
let repository = new Repository.SnRepository({
  RepositoryUrl: 'http://path-to-your-portal.com',
  ODataToken: 'MyODataServiceToken',
})
```

## Import

```
import { Actions } '@sensenet/redux';
import { Task } from '@sensenet/default-content-types'

...
const content = { Id: 123 } as Task;
...
store.dispatch(Actions.DeleteContent(content.Id, false));
```

## Building sn-redux

Building the project, running all the unit tests and the ts linter and get the code coverage report, use:

```
npm run build
```

## Running tests

To execute all unit tests and generate coverage reports, use:

```
npm t
```

## Examples

#### Combine custom reducer with the built-in ones

```
import { combineReducers } from 'redux';
import { Reducers } from  '@sensenet/redux';

const sensenet = Reducers.sensenet;
const myReducer = combineReducers({
  sensenet,
  listByFilter
});

```

#### Creating a store

```
import { Store } from  '@sensenet/redux';
import { Repository } from '@sensenet/client-core';

const repository = new Repository({
  repositoryUrl: 'http://path-to-your-portal.com',
})

const options = {
  repository,
  rootReducer: myReducer,
} as Store.CreateStoreOptions


const store = Store.createSensenetStore(options)

```

#### Using built-in actions

```
import { Repository } from '@sensenet/client-core';
import { Task } from '@sensenet/default-content-type'
import { Actions } from '@sensenet/redux';

const repository = new Repository({
  repositoryUrl: 'http://path-to-your-portal.com',
})

const parentPath = '/workspaces/Project/budapestprojectworkspace/tasks';
const content = {
          Id: 123,
          DisplayName: 'My first task'
      } as Task);

dispatch(Actions.CreateContent(parentPath, content, 'Task'))
```

## Documentation

- [sn-redux API Reference](https://community.sensenet.com/api/sn-redux/)
- [sn-client-core API reference](https://community.sensenet.com/api/@sensenet/client-core/)
- [sn-redux-promise-middleware API reference](https://community.sensenet.com/api/sn-redux-promise-middleware/)
- [About OData REST API in sensenet](https://community.sensenet.com/docs/odata-rest-api/)
- [About Built-in OData Actions and Function in sensenet](https://community.sensenet.com/docs/built-in-odata-actions-and-functions/)
- [Todo App with React, Redux and sensenet](https://github.com/SenseNet/sn-react-redux-todo-app)

## Influences

- [Redux](http://redux.js.org/)
- [Getting started with Redux](https://egghead.io/courses/getting-started-with-redux) - Awesome course from the creator of Redux, Dan Abramov.
- [Building React Applications with Idiomatic Redux](https://egghead.io/courses/building-react-applications-with-idiomatic-redux) - Another great course of Dan Abramov about building apps with Redux.
- [redux-promise-middleware](https://github.com/pburtchaell/redux-promise-middleware)

## Example applications

- [Using React](https://github.com/SenseNet/sn-react-redux-todo-app)
- [Sensenet DMS Demo](https://github.com/SenseNet/sn-dms-demo)
