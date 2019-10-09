# sn-react-typescript-boilerplate

[![Netlify Status](https://api.netlify.com/api/v1/badges/f3d58505-1366-49cc-b6f2-4b2fcc560966/deploy-status)](https://app.netlify.com/sites/sn-react-typescript-boilerplate/deploys)

Boilerplate app for sensenet SPA development with React and Typescript

## Package content

- An example _Hello World_ React SPA with sensenet repository login, written in Typescript ✨
- An example Jest test with Enzyme 👓
- Preconfigured Webpack build 🧱
- prettier and eslint 💅
- husky lint & prettier precommit hook ⚓

## Getting started

Be sure that you have installed a GIT client, Node.JS (latest or LTS). You can use NPM or Yarn.

### Using as a template

1. Create a GIT repository with [this template](https://github.com/SenseNet/sn-react-typescript-boilerplate/generate)
1. Clone your repository with `git clone <enter-your-git-repo-url-here>`
1. cd into the cloned directory
1. Install the package dependencies with `npm install` or `yarn install`

### Starting the dev server

1. Start the Webpack dev server with `npm run start` or `yarn start`
1. You can browse the app once the build has been finished at [http://localhost:8080/](http://localhost:8080/)

### Building the project

You can simply run `npm run build` or `yarn build` to create the bundle. It will saved to the `./bundle` directory

### Running tests

1. Simply run `npm run test` or `yarn test` to run the tests. A coverage report will be also generated to the `./coverage` directory

### Application Structure

```
- src
  | - assets
  | | - static assets like images, fonts, etc...
  | - components
  | | - generic components like forms, buttons, inputs
  | - context
  | | - React contexts and context providers
  | - hooks
  | | - Custom React hooks like useCurrentUser.
  | ...
  | main / container components, layouts
  | ...
  | - app.tsx - The main entry point of your application
  | - index.tsx - React and Sensenet Repository initialization
  | - style.css - generic css overrides
```

## Recommended goodies

- [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
