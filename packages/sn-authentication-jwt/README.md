# @sensenet/authentication-jwt

> This NPM package contains a client-side JWT authentication service implementation for [sensenet](https://github.com/SenseNet/sensenet).

[![NPM version](https://img.shields.io/npm/v/@sensenet/authentication-jwt.svg?style=flat)](https://www.npmjs.com/package/@sensenet/authentication-jwt)
[![NPM downloads](https://img.shields.io/npm/dt/@sensenet/authentication-jwt.svg?style=flat)](https://www.npmjs.com/package/@sensenet/authentication-jwt)
[![License: GPL v2](https://img.shields.io/badge/License-GPL%20v2-blue.svg)](https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html)

## Install

```bash
# Yarn
yarn add @sensenet/authentication-jwt

# NPM
npm install @sensenet/authentication-jwt
```

## Setup and usage

You can use JWT authentication with a [preconfigured](https://community.sensenet.com/docs/web-token-authentication/) sensenet >7.0.0 backend.

- **sessionLifetime** - You can change how user sessions should be persisted on the client, you can use _'session'_, which means the user will be logged out when the browser is closed, or _'expiration'_, in that case the token expiration property will be used. This behavior is implemented for JWT Authentication. (See [JWT Token docs](http://community.sensenet.com/docs/web-token-authentication/) for further details)

Service setup:

```ts
import { TokenPersist } from '@sensenet/authentication-jwt'

const repository = new Repository()
const jwtService = new JwtService(repository, { select: 'all' }, 5000, TokenPersist.Expiration)
```

### Login / logout:

You can log in and out using the following API endpoints:

```ts
const loginSuccess = await repository.authentication.login('username', 'password')
const logoutSuccess = await repository.authentication.logout()
```

### State and user changes

You can subscribe to authentication state and current user changes using the following two observable values:

```ts
jwtService.currentUser.subscribe(newUser => {
  console.log('User changed. New user: ', newUser.LoginName)
})

jwtService.state.subscribe(newState => {
  console.log('Authentication state changed to', newState)
})
```

### Authenticated requests

Please note that if you want to send custom _authenticated_ requests to the content repository, always use the `repository.fetch(...)` method. This ensures that your access token will be renewed if needed and your authentication state will consistent.
