<p>
  <a href="https://sensenet.com/" target="_blank">
    <img alt="sensenet" src="https://www.sensenet.com/Root/Skins/sncom/images/logo.png">
  </a>
</p>

# sensenet client

[![Build Status](https://travis-ci.org/SenseNet/sn-client.svg?branch=master)](https://travis-ci.org/SenseNet/sn-client)
[![Coverage](https://img.shields.io/codecov/c/github/SenseNet/sn-client.svg?style=flat)](https://codecov.io/gh/SenseNet/sn-client)
[![Gitter chat](https://img.shields.io/gitter/room/SenseNet/sensenet.svg?style=flat)](https://gitter.im/SenseNet/sensenet)

This repository is a monorepo that we manage using [Lerna](https://github.com/lerna/lerna). That means that we actually publish [several packages](/packages) to npm from the same codebase, including:

| Package                                                                     | Version                                                                                                                                                     |
| --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [@sensenet/authentication-google](/packages/sn-client-auth-google)          | [![npm](https://img.shields.io/npm/v/@sensenet/authentication-google.svg?maxAge=3600)](https://www.npmjs.com/package/@sensenet/authentication-google)       |
| [@sensenet/authentication-jwt](/packages/sn-authentication-jwt)             | [![npm](https://img.shields.io/npm/v/@sensenet/authentication-jwt.svg?maxAge=3600)](https://www.npmjs.com/package/@sensenet/authentication-jwt)             |
| [@sensenet/client-core](/packages/sn-client-core)                           | [![npm](https://img.shields.io/npm/v/@sensenet/client-core.svg?maxAge=3600)](https://www.npmjs.com/package/@sensenet/client-core)                           |
| [@sensenet/client-utils](/packages/sn-client-utils)                         | [![npm](https://img.shields.io/npm/v/@sensenet/client-utils.svg?maxAge=3600)](https://www.npmjs.com/package/@sensenet/client-utils)                         |
| [@sensenet/control-mapper](/packages/sn-control-mapper)                     | [![npm](https://img.shields.io/npm/v/@sensenet/control-mapper.svg?maxAge=3600)](https://www.npmjs.com/package/@sensenet/control-mapper)                     |
| [@sensenet/controls-react](/packages/sn-controls-react)                     | [![npm](https://img.shields.io/npm/v/@sensenet/controls-react.svg?maxAge=3600)](https://www.npmjs.com/package/@sensenet/controls-react)                     |
| [@sensenet/default-content-types](/packages/sn-default-content-types)       | [![npm](https://img.shields.io/npm/v/@sensenet/default-content-types.svg?maxAge=3600)](https://www.npmjs.com/package/@sensenet/default-content-types)       |
| [@sensenet/document-viewer-react](/packages/sn-document-viewer-react)       | [![npm](https://img.shields.io/npm/v/@sensenet/document-viewer-react.svg?maxAge=3600)](https://www.npmjs.com/package/@sensenet/document-viewer-react)       |
| [@sensenet/icons-react](/packages/sn-icons-react)                           | [![npm](https://img.shields.io/npm/v/@sensenet/icons-react.svg?maxAge=3600)](https://www.npmjs.com/package/@sensenet/icons-react)                           |
| [@sensenet/list-controls-react](/packages/sn-list-controls-react)           | [![npm](https://img.shields.io/npm/v/@sensenet/list-controls-react.svg?maxAge=3600)](https://www.npmjs.com/package/@sensenet/list-controls-react)           |
| [@sensenet/pickers-react](/packages/sn-pickers-react)                       | [![npm](https://img.shields.io/npm/v/@sensenet/pickers-react.svg?style=flat)](https://www.npmjs.com/package/@sensenet/pickers-react)                        |
| [@sensenet/query](/packages/sn-query)                                       | [![npm](https://img.shields.io/npm/v/@sensenet/query.svg?maxAge=3600)](https://www.npmjs.com/package/@sensenet/query)                                       |
| [@sensenet/redux-promise-middleware](/packages/sn-redux-promise-middleware) | [![npm](https://img.shields.io/npm/v/@sensenet/redux-promise-middleware.svg?maxAge=3600)](https://www.npmjs.com/package/@sensenet/redux-promise-middleware) |
| [@sensenet/redux](/packages/sn-redux)                                       | [![npm](https://img.shields.io/npm/v/@sensenet/redux.svg?maxAge=3600)](https://www.npmjs.com/package/@sensenet/redux)                                       |
| [@sensenet/repository-events](/packages/sn-repository-events)               | [![npm](https://img.shields.io/npm/v/@sensenet/repository-events.svg?maxAge=3600)](https://www.npmjs.com/package/@sensenet/repository-events)               |
| [@sensenet/search-react](/packages/sn-search-react)                         | [![npm](https://img.shields.io/npm/v/@sensenet/search-react.svg?maxAge=3600)](https://www.npmjs.com/package/@sensenet/search-react)                         |


