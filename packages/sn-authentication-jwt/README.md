# sn-authentication-jwt

[![Gitter chat](https://img.shields.io/gitter/room/SenseNet/SN7ClientAPI.svg?style=flat)](https://gitter.im/SenseNet/SN7ClientAPI)
[![Build Status](https://travis-ci.org/SenseNet/sn-authentication-jwt.svg?branch=master)](https://travis-ci.org/SenseNet/sn-authentication-jwt)
[![codecov](https://codecov.io/gh/SenseNet/sn-authentication-jwt/branch/master/graph/badge.svg)](https://codecov.io/gh/SenseNet/sn-authentication-jwt)
[![Greenkeeper badge](https://badges.greenkeeper.io/SenseNet/sn-authentication-jwt.svg)](https://greenkeeper.io/)
[![NPM version](https://img.shields.io/npm/v/@sensenet/authentication-jwt.svg?style=flat)](https://www.npmjs.com/package/@sensenet/client-utils)
[![NPM downloads](https://img.shields.io/npm/dt/@sensenet/authentication-jwt.svg?style=flat)](https://www.npmjs.com/package/@sensenet/client-utils)
[![License](https://img.shields.io/github/license/SenseNet/sn-authentication-jwt.svg?style=flat)](https://github.com/sn-authentication-jwt/LICENSE.txt)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat)](http://commitizen.github.io/cz-cli/)

This NPM package contains a client-side JWT authentication service implementation for [sensenet ECM](https://github.com/SenseNet/sensenet).

## Installation

```shell
npm install @sensenet/authentication-jwt
```

## Setup and usage
You can use JWT authentication with a [preconfigured](https://community.sensenet.com/docs/web-token-authentication/) sensenet >7.0.0 backend.

Service setup:
```ts
const repository = new Repository();
const jwtService = new JwtService(repository);
```

### Login / logout:

You can log in and out using the following API endpoints:

```ts
const loginSuccess = await repository.authentication.login("username", "password");
const logoutSuccess = await repository.authentication.logout();
```

### State and user changes

You can subscribe to authentication state and current user changes using the following two observable values:

```ts
jwtService.currentUser.subscribe((newUser) => {
    console.log("User changed. New user: ", newUser.LoginName);
});

jwtService.state.subscribe((newState) => {
    console.log("Authentication state changed to", newState);
});
```

### Authenticated requests

Please note that if you want to send custom *authenticated* requests to the content repository, always use the ``repository.fetch(...)`` method. This ensures that your access token will be renewed if needed and your authentication state will consistent.
