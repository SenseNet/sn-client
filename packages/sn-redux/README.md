# sn-redux

[![Gitter chat](https://img.shields.io/gitter/room/SenseNet/sn-redux.svg?style=flat)](https://gitter.im/SenseNet/sn-redux)
[![Build status](https://img.shields.io/travis/SenseNet/sn-redux.svg?style=flat)](https://travis-ci.org/SenseNet/sn-redux)
[![Coverage](https://img.shields.io/codecov/c/github/SenseNet/sn-redux.svg?style=flat)](https://codecov.io/gh/SenseNet/sn-redux)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/ca48bc7efa8549f091aa598e17ccc742)](https://www.codacy.com/app/herflis33/sn-redux?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=SenseNet/sn-redux&amp;utm_campaign=Badge_Grade)
[![NPM version](https://img.shields.io/npm/v/sn-redux.svg?style=flat)](https://www.npmjs.com/package/sn-redux)
[![NPM downloads](https://img.shields.io/npm/dt/sn-redux.svg?style=flat)](https://www.npmjs.com/package/sn-redux)
[![License](https://img.shields.io/github/license/SenseNet/sn-redux.svg?style=flat)](https://github.com/SenseNet/sn-redux/LICENSE.txt)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat)](http://commitizen.github.io/cz-cli/)
[![Greenkeeper badge](https://badges.greenkeeper.io/SenseNet/sn-redux.svg)](https://greenkeeper.io/)
<<<<<<< HEAD
=======

>>>>>>> master


sn-redux is a convention driven way of building sensenet ECM applications using Redux. It contains all the action types, actions and reducers for [built-in sensenet Actions 
and Functions](http://wiki.sensenet.com/Built-in_OData_actions_and_functions).

sn-redux gives you a standard set of:

* action types: e.g. CREATE_CONTENT_SUCCESS
* actions: e.g. updateContentSuccess, updateContentFailure
* reducers: for the action types above e.g. updateContentSuccess
* epics: for streams of actions that are related to the same process e.g. createContentEpic

## Installation on an existing sensenet ECM portal

Get the latest stable version with npm

```
npm install --save sn-redux
```

or from the [GitHub repository](https://github.com/SenseNet/sn-redux) and place the downloaded source into your project. If you want to use only the transpiled JavaScript
modules, you can find them in the dist/src folder and import them like

```
var SN = require('/pathtomodule/sn-redux');
```

If you want to use the module types you can find them in the src folder. Import them the following way:

```
import { Actions } from 'sn-redux';

store.dispatch(Actions.Delete(123, false));
```

## Installation into an external app with node and npm

To install the latest stable version

```
npm install --save sn-redux
```

Create your sensenet ECM portal Repository to use. You can configure your Store to use this repository, when calling Store.ConfigureStore

```ts
import { Repository } from 'sn-client-js';

let repository = new Repository.SnRepository({
  RepositoryUrl: 'http://path-to-your-portal.com',
});

const store = Store.configureStore(
    myRootReducer,
    myRootEpic,                   // If not set, the default will be 'Epics.rootEpic'
    [middleware1, middleware2],   // If not set, only the epicMiddleware will be used
    persistedState,               // Optional
    repository                    // Optional. If not provided, a Repository with default values will be used
    );


```

To enable your external app to send request against your sensenet ECM portal change your ```Portal.settings```. For further information about cross-origin resource sharing in Sense/Net check [this](http://wiki.sensenet.com/Cross-origin_resource_sharing#Origin_check) article.

Check your sensenet ECM portal's web.config and if the ```ODataServiceToken``` is set, you can pass to your Repository as a config value on client side.

```ts
let repository = new Repository.SnRepository({
  RepositoryUrl: 'http://path-to-your-portal.com',
  ODataToken: 'MyODataServiceToken'
});
```

## Import

### CommonJS

```
var Actions = require('sn-redux').Actions;

store.dispatch(Actions.Delete(123, false));
```

## Typescript

```
import { Actions } 'sn-redux';

store.dispatch(Actions.Delete(123, false));
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
import { Reducers } from  'sn-redux';

const collection = Reducers.collection;
const myReducer = combineReducers({
  collection,
  listByFilter
});

```

#### Creating a store

```
import { Store } from  'sn-redux';

const store = Store.configureStore(myReducer);
```

#### Using built-in actions

```
import { Content } from 'sn-client-js';
import { Actions } from 'sn-redux';

const parentPath = '/workspaces/Project/budapestprojectworkspace/tasks';
const content = new Content({
          Type: 'Task',
          DisplayName: 'My first task'
      });

dispatch(Actions.CreateContent(parentPath, content))
```

## Documentation

* [sn-redux API Reference](http://www.sensenet.com/documentation/sn-redux/index.html)
* [sn-client-js API reference](http://www.sensenet.com/documentation/sn-client-js/index.html)
* [About OData REST API in Sense/Net ECM](http://wiki.sensenet.com/OData_REST_API)
* [About Built-in OData Actions and Function in Sense/Net ECM](http://wiki.sensenet.com/Built-in_OData_actions_and_functions)
* [Todo App with React, Redux and Sense/Net ECM](http://www.sensenet.com/documentation/sn-react-todoapp/index.html)

## Influences

* [Redux](http://redux.js.org/)
* [Getting started with Redux](https://egghead.io/courses/getting-started-with-redux) - Awesome course from the creator of Redux, Dan Abramov.
* [Building React Applications with Idiomatic Redux](https://egghead.io/courses/building-react-applications-with-idiomatic-redux) - Another great course of Dan Abramov about building apps with Redux.
* [rxjs](http://reactivex.io/rxjs/)
* [redux-observable](https://redux-observable.js.org/)

## Example applications
* Using Raw Javascript and HTML (TODO)
* [Using React](https://github.com/SenseNet/sn-react-redux-todo-app)
* [Using Angular](https://github.com/blaskodaniel/sn-angular-redux-todo-app)
* [Using Angular2](https://github.com/SenseNet/sn-angular2-redux-todo-app)
* [Using Vue.js](https://github.com/SenseNet/sn-vue-redux-todo-app)
* [Using Aurelia](https://github.com/B3zo0/sn7-aurelia-redux-todo-app)
* Using Ember (TODO)
* Using Polymer (TODO)
* Using React Native (TODO)
