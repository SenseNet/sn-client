# sn-blog-gatsby

This example demonstrates how to create an app with sensenet and Gatsby using sensenet source plugin. It's a good starter for building a blog sourcing data from sensenet.

## Quick start

```shell
TODO: This will change soon
```

## Features

- A simple blog built with sensenet
- Uses typescript
- Uses gatsby-plugin-material-ui for styling
- Uses prismjs for code highlighting
- Uses date-fns for date formatting
- Uses gatsby-plugin-mdx to process mdx
- Uses gatsby-plugin-image for image rendering

## Configuration

You have to add urls of your sensenet repository and identity server to _configuration.js_:

```javascript
exports.repositoryUrl = '<YOUR REPOSITORY URL>'

exports.configuration = {
  clientId: process.env.GATSBY_REACT_APP_CLIENT_ID || '',
  clientSecret: process.env.GATSBY_REACT_APP_CLIENT_SECRET || '',
  identityServerUrl: '<YOUR IDENTITY SERVER URL>',
}
```

**GATSBY_REACT_APP_CLIENT_ID** and **GATSBY_REACT_APP_CLIENT_SECRET** environmental variables should be defined.

You can easily store them in .env files by doing the following:

```javascript
// In your .env file
GATSBY_REACT_APP_CLIENT_ID=<YOUR CLIENT ID>
GATSBY_REACT_APP_CLIENT_SECRET=<YOUR SECRET>

```

### Where can you get the missing information?

There are two ways to get your client_id and client_secret:
You can find them on your [snaas user profile](https://docs.sensenet.com/concepts/basics/06-authentication-secrets) or on the [admin-ui](https://docs.sensenet.com/guides/settings/api-and-security) logged-in to the repository as well. Also here can be found the repository url and url of the identity server.

## Deployment

See the official [connecting to sensenet](https://docs.sensenet.com/integrations/gatsby/connecting_to_sensenet) guide.
