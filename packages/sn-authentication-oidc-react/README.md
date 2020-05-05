# @sensenet/authentication-oidc-react

> @sensenet/authentication-oidc-react is a react component library that uses React context api for authenticating with oidc client.

[![NPM version](https://img.shields.io/npm/v/@sensenet/authentication-oidc-react.svg?style=flat)](https://www.npmjs.com/package/@sensenet/authentication-oidc-react)
[![NPM downloads](https://img.shields.io/npm/dt/@sensenet/authentication-oidc-react.svg?style=flat)](https://www.npmjs.com/package/@sensenet/authentication-oidc-react)
[![License: GPL v2](https://img.shields.io/badge/License-GPL%20v2-blue.svg)](https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html)

## Install

```bash
# Yarn
yarn add @sensenet/authentication-oidc-react

# NPM
npm install @sensenet/authentication-oidc-react
```

## Usage

There are 2 components and 1 hook that you can use. `AuthenticationProvider`, `OidcSecure`, `useOidcAuthentication`.

### AuthenticationProvider

For `AuthenticationProvider` to work properly you must pass a configuration object. To work with sensenet you must include `sensenet` as a scope and add the repository url as `snrepo` to `extraQueryParams`. See the example below for proper configuration.

**Props**

| name                      | type                                        | required | description                                                                                                                                        |
| ------------------------- | ------------------------------------------- | :------: | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| history                   | History from 'history'                      |    ✔     | history object from react-router or history package. Needed for navigation.                                                                        |
| configuration             | UserManagerSettings from 'oidc-client'      |    ✔     | configuration object for oidc-client. These properties are required: client_id, redirect_uri, response_type, scope, authority, silent_redirect_uri |
| children                  | ReactNode                                   |    ✔     | You can only use AuthenticationProvider as a wrapper.                                                                                              |
| customEvents              | CustomEvents                                |          | You can subscribe to oidc events like userLoaded. Be aware that this object should not change during rerender. Eg.: you should wrap it in useMemo. |
| authenticating            | ReactNode                                   |          | Component shown when OidcSecure is used and login is required.                                                                                     |
| notAuthenticated          | ReactNode                                   |          | Component shown on route /authentication/not-authenticated                                                                                         |
| notAuthorized             | ReactNode                                   |          | Component shown on route /authentication/not-authorized                                                                                            |
| sessionLost               | ElementType<{ onAuthenticate: () => void }> |          | Component shown on route /authentication/session-lost                                                                                              |
| callbackComponentOverride | ReactNode                                   |          | Component shown when login is redirecting back.                                                                                                    |

**Example**

```typescript
import { AuthenticationProvider, useOidcAuthentication, UserManagerSettings } from '@sensenet/authentication-oidc-react'
import { Repository } from '@sensenet/client-core'
import { RepositoryContext } from '@sensenet/hooks-react'
import React, { PropsWithChildren } from 'react'
import { BrowserRouter, useHistory } from 'react-router-dom'

export const repositoryUrl = 'https://my-service.sensenet.com/'

export const configuration: UserManagerSettings = {
  client_id: 'spa',
  automaticSilentRenew: true,
  redirect_uri: 'http://localhost:3000/authentication/callback',
  response_type: 'code',
  post_logout_redirect_uri: 'http://localhost:3000/',
  scope: 'openid profile sensenet',
  authority: 'https://is.my-service.sensenet.com/',
  silent_redirect_uri: 'http://localhost:3000/authentication/silent_callback',
  extraQueryParams: { snrepo: repositoryUrl },
}

export function AppProviders({ children }: PropsWithChildren<{}>) {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RepositoryProvider>{children}</RepositoryProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export const AuthProvider = ({ children }: PropsWithChildren<{}>) => {
  const history = useHistory()

  return (
    <AuthenticationProvider configuration={configuration} history={history}>
      {children}
    </AuthenticationProvider>
  )
}

export const RepositoryProvider = ({ children }: PropsWithChildren<{}>) => {
  const { oidcUser } = useOidcAuthentication()

  if (!oidcUser) {
    return <LoginForm />
  }

  return (
    <RepositoryContext.Provider value={new Repository({ repositoryUrl, token: oidcUser.access_token })}>
      {children}
    </RepositoryContext.Provider>
  )
}
```

### OidcSecure

This component can be used to secure routes that needs authentication. This must be inside a router and the AuthenticationProvider of course .

**Props**

| name     | type                   | required | description                                                                 |
| -------- | ---------------------- | :------: | --------------------------------------------------------------------------- |
| history  | History from 'history' |    ✔     | history object from react-router or history package. Needed for navigation. |
| children | ReactNode              |    ✔     | You can only use OidcSecure as a wrapper.                                   |

**Example**

```typescript
import React from 'react'
import { Switch, Route, useHistory } from 'react-router-dom'

const Routes = () => (
  <Switch>
    <Route path="/admin" component={Admin} />
  </Switch>
)

const Admin = ({ oidcUser }) => {
  const history = useHistory()

  return (
    <OidcSecure history={history}>
      <h1>Admin</h1>
      <p>Protected Admin</p>
    </OidcSecure>
  )
}
```

### useOidcAuthentication

Custom hook for AuthenticationContext value. This hook can only be used inside the AuthenticationProvider.

**Example**

```typescript
import React from 'react'
import { useOidcAuthentication } from '@sensenet/authentication-oidc-react'

const NavBar = ({ oidcUser }) => {
  const { login, logout, oidcUser, error, isLoading } = useOidcAuthentication()

  if (isLoading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p>Error: {error}</p>
  }

  return (
    <nav>
      <ul>
        <li onClick={login}>login</li>
        <li onClick={logout}>logout</li>
      </ul>
    </nav>
  )
}
```
