# @sensenet/authentication-google

> This package contains a client-side Google Oauth2 authentication provider for sensenet.

[![NPM version](https://img.shields.io/npm/v/@sensenet/authentication-google.svg?style=flat)](https://www.npmjs.com/package/@sensenet/authentication-google)
[![NPM downloads](https://img.shields.io/npm/dt/@sensenet/authentication-google.svg?style=flat)](https://www.npmjs.com/package/@sensenet/authentication-google)
[![License: GPL v2](https://img.shields.io/badge/License-GPL%20v2-blue.svg)](https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html)

## Install

```bash
# Yarn
yarn add @sensenet/authentication-google

# NPM
npm install @sensenet/authentication-google
```

## Usage

### Prerequisites

- sensenet 7.0 with an installed Google OAuth provider
- [Google API Console project](https://developers.google.com/identity/sign-in/web/devconsole-project)
- _(optional)_ [Google Platform Library](https://developers.google.com/identity/sign-in/web/sign-in) or another Google OAuth component that can retrieve _id_token_

### Setup

You can set up the Provider after creating your repository singleton with the **addGoogleAuth** method

```ts
import { Repository } from '@sensenet/client-core'
import { JwtService } from '@sensenet/authentication-jwt'
import { addGoogleAuth } from '@sensenet/authentication-google'

const repo = new Repository()
const jwt = new JwtService(repo)
const googleOauthProvider = addGoogleAuth(jwt, { clientId: '' })
```

### Login

In your login component, you can use the following snippet. If you don't provide an _id_token_ from an external component, the package will try to retrieve it using a popup window (in that case you have to enable popups and add a callback pointing to your window's origin)

```ts
// an example login method with an optional idToken:
async Login(idToken?: string){
 try {
     await googleOauthProvider.login(idToken);
     console.log('Logged in');
 } catch (error) {
    console.warn('Error during login', error);
 }
}
```
