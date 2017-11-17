# sn-client-auth-google

[![Gitter chat](https://img.shields.io/gitter/room/SenseNet/SN7ClientAPI.svg?style=flat)](https://gitter.im/SenseNet/SN7ClientAPI)
[![Build Status](https://travis-ci.org/SenseNet/sn-client-auth-google.svg?branch=master)](https://travis-ci.org/SenseNet/sn-client-auth-google)
[![codecov](https://codecov.io/gh/SenseNet/sn-client-auth-google/branch/master/graph/badge.svg)](https://codecov.io/gh/SenseNet/sn-client-auth-google)
[![License](https://img.shields.io/github/license/SenseNet/sn-client-js.svg?style=flat)](https://github.com/SenseNet/sn-client-js/LICENSE.txt)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat)](http://commitizen.github.io/cz-cli/)
[![Greenkeeper badge](https://badges.greenkeeper.io/SenseNet/sn-client-auth-google.svg)](https://greenkeeper.io/)

This package contains a client-side Google Oauth2 authentication provider for sensenet ECM through [sn-client-js](https://www.npmjs.com/package/sn-client-js)

## Installation with node and npm

To install the latest version run
```
npm install --save sn-client-js
```

## Usage

### Prerequisites
 - sensenet ECM 7.0 with an installed Google OAuth provider
 - [Google API Console project](https://developers.google.com/identity/sign-in/web/devconsole-project)
 - *(optional)* [Google Platform Library](https://developers.google.com/identity/sign-in/web/sign-in) or another Google OAuth component that can retrieve *id_token*

### Setup

You can set up the Provider after creating your repository singleton with the **AddGoogleAuth** method
```ts
import { Repository } from 'sn-client-js'
import { AddGoogleAuth } from 'sn-client-auth-google';

const myRepository = new Repository.SnRepository();

AddGoogleAuth(myRepository, {
     ClientId: myGoogleClientId
});
```


### Login

In your login component, you can use the following snippet. If you don't provide an *id_token* from an external component, the package will try to retrieve it using a popup window (in that case you have to enable popups and add a callback pointing to your window's origin)

```ts
// an example login method with an optional idToken:
async Login(idToken?: string){
 try {
     await myRepository.Authentication.GetOauthProvider(GoogleOauthProvider).Login(idToken);
     console.log('Logged in');
 } catch (error) {
    console.warn('Error during login', error);
 }
}
```
