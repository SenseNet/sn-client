# Todo App example with SN7, React and Redux

> This example is simple todo app built with React+Redux upon sensenet which has been prepared to demonstrate how to use the new sensenet related libraries [sn-client-js](https://github.com/SenseNet/sn-client-js) and [sn-redux](https://github.com/SenseNet/sn-redux).

The app and a steps of the related tutorial are based on two awesome Redux courses of Dan Abramov:
[Getting Started with Redux](https://egghead.io/courses/getting-started-with-redux) and [Building React Applications with Idiomatic Redux](https://egghead.io/courses/building-react-applications-with-idiomatic-redux).
These two courses are extremely helpful and essential, recommended for everyone who is interested in building scalable apps with [Redux](http://redux.js.org/).

## Quick start

```bash
$ git clone https://github.com/SenseNet/sn-client.git
$ yarn
$ yarn build
$ yarn workspace sn-react-redux-todo-app start
```

## Settings

To use this example you'll need a sensenet portal. To connect the app with the portal create a repository and set its RepositoryUrl

```ts
import { Repository } from '@sensenet/client-core'

const repository = new Repository.SnRepository({
  RepositoryUrl: 'https://sn-services/',
})
```

If you've created your app, with sn-client-cli you can set the RepositoryUrl in the related config file (sn.config.js in your projets root) too.

```json
{
  "RepositoryUrl": "https://sn-services/"
}
```

In this case you can define your repository the following way:

```tsx
import { Repository } from '@sensenet/client-core'
import * as snConfig from './sn.config.js'

const repository = new Repository(snConfig)
```

To allow outer origins go to your portal's Portal.setting (/Root/System/Settings/Portal.settings). To get the app working you have to add the app's domain as an allowed origin so that the app can send requests to the
portal and get or set data.

```json
{
  "AllowedOriginDomains": ["localhost:13505"]
}
```

For further information about CORS in sensenet check [this](http://community.sensenet.com/docs/cors/) article.

The example app uses a TaskList Content that should be created in sensenet portal. In the downloadable example it is '/Root/Sites/Default_Site/tasks' so if you want to try it with your custom sensenet install (no matter which one, eg, services, webpages, etc), you can create it at the same path, or modify it in the VisibleTodoList.tsx and the App.tsx files.

The example app demonstrates not only how to fetching data but also Content creation, edit and delete. The app provides authentication (for further information please check the docs with the ['jwt' tag](http://community.sensenet.com/tags/#jwt)), please check that the permission of the users are set correctly to run the mentioned applications.

If you are not familiar with sensenet's permission system check the following wiki articles:

- [sensenet Permission System](http://wiki.sensenet.com/Permission_System)
- [How to set permissions on a content in sensenet](http://wiki.sensenet.com/How_to_set_permissions_on_a_content)

## Related documents

- [Redux](https://github.com/reduxjs/redux)
- [Getting Started with Redux](https://egghead.io/courses/getting-started-with-redux)
- [Building React Applications with Idiomatic Redux](https://egghead.io/courses/building-react-applications-with-idiomatic-redux)
