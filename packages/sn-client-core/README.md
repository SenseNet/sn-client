# @sensenet/client-core

> This component lets you work with the [sensenet](https://github.com/SenseNet/sensenet) Content Repository (create or manage content, execute queries, etc.) by providing a JavaScript client API for the main content operations.
> The library connects to a sensenet's [REST API](https://docs.sensenet.com/api-docs/basic-concepts), but hides the underlying HTTP requests. You can work with simple load or create Content operations in JavaScript, instead of having to construct ajax requests yourself.

[![NPM version](https://img.shields.io/npm/v/@sensenet/client-core.svg?style=flat)](https://www.npmjs.com/package/@sensenet/client-core)
[![NPM downloads](https://img.shields.io/npm/dt/@sensenet/client-core.svg?style=flat)](https://www.npmjs.com/package/@sensenet/client-core)
[![License: GPL v2](https://img.shields.io/badge/License-GPL%20v2-blue.svg)](https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html)
[![Sense/Net Services](https://img.shields.io/badge/sensenet-7.1.3%20tested-green.svg)](https://github.com/SenseNet/sensenet/releases/tag/v7.1.3)

## Install

```bash
# Yarn
yarn add @sensenet/client-core

# NPM
npm install @sensenet/client-core
```

## Usage

### Creating a Repository instance

Your main entry point in this library is the Repository object. You can create an Instance by the following way:

```ts
import { Repository } from '@sensenet/client-core'

const repository = new Repository({
  repositoryUrl: 'https://my-sensenet-site.com',
  oDataToken: 'OData.svc',
  defaultSelect: ['DisplayName', 'Icon'],
  requiredSelect: ['Id', 'Type', 'Path', 'Name'],
  defaultMetadata: 'no',
  defaultInlineCount: 'allpages',
  defaultExpand: [],
  defaultTop: 1000,
})
```

- **repositoryURL**: The component will communicate with your repositoy using the following url. This will fall back to your _window.location.href_, if not specified. To enable your external app to send request against your sensenet portal change your `Portal.settings`. For further information about cross-origin resource sharing in sensenet check [this](https://docs.sensenet.com/guides/setup)
  article
- **oDataToken**: Check your Sense/Net portal's web.config and if the `ODataServiceToken` is set, you can configure it here for the client side
- **token**: Access token to authorize access to data
- **defaultSelect** - These fields will be selected by default on each OData request. Can be a field, an array of fields or 'all'
- **requiredSelect** - These fields will always be included in the OData _\$select_ statement. Also can be a field, an array of fields or 'all'
- **defaultMetadata** - Default _metadata_ value for OData requests. Can be 'full', 'minimal' or 'no'
- **defaultInlineCount** - Default _inlinecount_ OData parameter. Can be 'allpages' or 'none'
- **defaultExpand** - Default fields to _\$expand_, empty by default. Can be a field or an array of fields.
- **defaultTop** - Default value to the odata _\$top_ parameter

### Loading content

You can load a specified content by its full path or Id by the following way:

```ts
import { User } from '@sensenet/default-content-types'

const user = await repository.load<User>({
  idOrPath: '/Root/IMS/BuiltIn/Portal/Visitor', // you can also load by content Id
  oDataOptions: {
    // You can provide additional OData parameters
    expand: ['CreatedBy'],
    select: 'all',
  },
})
console.log(user) // {d: { /*(...retrieved user data)*/ }}
```

You can also load a content reference by providing a full reference path (e.g.: `/Root/IMS/BuiltIn/Portal/('Visitor')/CreatedBy`)

If you want to load a content collection (children, query results or one-to-many references ) you can do it with the following method:

```ts
const portalUsers = await repository.loadCollection<User>({
  path: '/Root/IMS/BuiltIn/Portal',
  oDataOptions: {
    query: 'TypeIs:User',
    orderby: ['LoginName'],
  },
})

console.log('Count: ', portalUsers.d.__count)
console.log('Users: ', portalUsers.d.results)
```

### Creating and modifying content

You can execute specific POST, PATCH and PUT OData requests on the Repository instance:

```ts
const createdUser = await repository.post<User>({
  parentPath: 'Root/Parent',
  contentType: 'User',
  content: {
    Name: 'NewContent',
    /** ...additional content data */
  },
})

// you can also use PUT in the similar way
const lockedUser = await repository.patch<User>({
  idOrPath: 'Root/Path/To/User',
  content: {
    Locked: true,
  },
})
```

### Delete, move, copy batch actions

You can execute these batch actions right on the Repository instance:

```ts
// you can use move in the similar way
const copyResult = await repository.copy({
  idOrPath: [45, 'Root/Path/To/Content'],
  targetPath: 'Root/Target/Path',
})

const deleteResult = await repository.delete({
  idOrPath: 'Root/Path/To/Content/To/Delete',
  permanent: true,
})
```

### Executing custom actions

You can define and execute your custom OData actions by the following way:

```ts
interface CustomActionBodyType {
  Name: string
  Value: string
}
interface CustomActionReturnType {
  Result: any
}
const actionResult = await repository.executeAction<CustomActionBodyType, CustomActionReturnType>({
  idOrPath: 'Path/to/content',
  method: 'POST',
  name: 'MyOdataCustomAction',
  body: {
    Name: 'foo',
    Value: 'Bar',
  },
})
console.log(actionResult.Result)
```

### Shortcuts for built-in Odata actions

You can use built-in actions in the `repository.security` and in the `repository.versioning` namespaces on repository instances.
