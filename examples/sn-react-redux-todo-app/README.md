# Todo App example with SN7, React and Redux

[![Greenkeeper badge](https://badges.greenkeeper.io/SenseNet/sn-react-redux-todo-app.svg)](https://greenkeeper.io/)

[![Build status](https://img.shields.io/travis/SenseNet/sn-react-redux-todo-app.svg?style=flat)](https://travis-ci.org/SenseNet/sn-react-redux-todo-app)
[![Coverage](https://img.shields.io/codecov/c/github/SenseNet/sn-react-redux-todo-app.svg?style=flat)](https://codecov.io/gh/SenseNet/sn-react-redux-todo-app)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/b09d599538fa49e9bb1cb92df4042ada)](https://www.codacy.com/app/herflis33/sn-react-redux-todo-app?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=SenseNet/sn-react-redux-todo-app&amp;utm_campaign=Badge_Grade)
[![License](https://img.shields.io/github/license/SenseNet/sn-react-redux-todo-app.svg?style=flat)](https://github.com/SenseNet/sn-client-js/LICENSE.txt)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat)](http://commitizen.github.io/cz-cli/)

This example is simple todo app built with React+Redux upon sensenet which has been prepared to demonstrate how to use the new sensenet related libraries [sn-client-js](https://github.com/SenseNet/sn-client-js)
and [sn-redux](https://github.com/SenseNet/sn-redux). The app and a steps of the related tutorial are based on two awesome Redux courses of Dan Abramov: 
[Getting Started with Redux](https://egghead.io/courses/getting-started-with-redux) and [Building React Applications with Idiomatic Redux](https://egghead.io/courses/building-react-applications-with-idiomatic-redux). 
These two courses are extremely helpful and essential, recommended for everyone who is interested in building scalable apps with [Redux](http://redux.js.org/).

## Quick start

```
$ git clone https://github.com/SenseNet/sn-react-redux-todo-app.git
$ cd sn-react-redux-todo-app
$ npm install
$ npm start
```

## Settings

To use this example you'll need a sensenet portal. To connect the app with the portal create a repository and set its RepositoryUrl
```
import { Repository } from 'sn-client-js';

const repository = new Repository.SnRepository({
  RepositoryUrl: 'https://sn-services/'
});
```

If you've created your app, with sn-client-cli you can set the RepositoryUrl in the related config file (sn.config.js in your projets root) too.

```json
{
    RepositoryUrl: "https://sn-services/"
}
```

In this case you can define your repository the following way:

```tsx
import { Repository } from 'sn-client-js';
import * as snConfig from './sn.config.js';

const repository = new Repository.SnRepository(snConfig);
```

To allow outer origins go to your portal's Portal.setting (/Root/System/Settings/Portal.settings). To get the app working you have to add the app's domain as an allowed origin so that the app can send requests to the 
portal and get or set data.

```
{
   AllowedOriginDomains: [ "localhost:13505" ]
}
```

For further information about CORS in sensenet check [this](http://community.sensenet.com/docs/cors/) article.

The example app uses a TaskList Content that should be created in sensenet portal. In the downloadable example it is '/Root/Sites/Default_Site/tasks' so if you want to try it with your custom sensenet install (no matter which one, eg, services, webpages, etc), you can create it at the same path, or modify it in the VisibleTodoList.tsx and the App.tsx files.

The example app demonstrates not only how to fetching data but also Content creation, edit and delete. The app provides authentication (for further information please check the docs with the ['jwt' tag](http://community.sensenet.com/tags/#jwt)), please check that the permission of the users are set correctly to run the mentioned applications.

If you are not familiar with sensenet's permission system check the following wiki articles:
* [sensenet Permission System](http://wiki.sensenet.com/Permission_System)
* [How to set permissions on a content in sensenet](http://wiki.sensenet.com/How_to_set_permissions_on_a_content)

## Deployment

The app became now [create-react-app](https://github.com/facebookincubator/create-react-app) based, which means you can use its great tools with no extra configurations. Since all our related projects are written in Typescript we used here [create-react-app-typescript].(https://github.com/wmonk/create-react-app-typescript).

To build the project run

```
npm build
```

It will transpile the .ts and .tsx files to JavaScript and copy them along with the sourcemaps to the dist folder along with the .css files.

To run the tests

```
npm test
```

## Related documents

* [sn-client-js API reference](http://www.sensenet.com/documentation/sn-client-js/index.html)
* [sn-redux API reference](http://www.sensenet.com/documentation/sn-redux/index.html)
* [Redux](https://github.com/reactjs/redux)
* [Getting Started with Redux](https://egghead.io/courses/getting-started-with-redux)
* [Building React Applications with Idiomatic Redux](https://egghead.io/courses/building-react-applications-with-idiomatic-redux)
