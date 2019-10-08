# How to contribute

Thank you for checking out our project! :star2: :sunny: :deciduous_tree: :earth_americas:

Please visit the [contribution guide](https://github.com/SenseNet/sensenet/blob/master/CONTRIBUTING.md) in our main repository for advice on how to help the community.

# Development Guide

### Prerequisites

Please have the **_latest_** stable versions of the following on your machine

- node
- yarn

### Initial Setup

If you run into trouble here, make sure your node, npm, and **_yarn_** are on the latest versions (yarn at least v1.3.2).

1.  `git clone https://github.com/SenseNet/sn-client.git` _bonus_: use your own fork for this step
2.  `cd sn-client`
3.  `yarn`
4.  `yarn build` to compile all the typescript packages
5.  `yarn test` to run unit tests

#### Branching

We use [Gitflow workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow).

This means that we use a develop branch for the main development.

When you start to work on a new feature or bug you:

1. checkout develop
2. pull latest develop
3. create a new branch from develop
4. make some changes in code or documentation
5. create a pull request to develop

### Running package script

With yarn you can run any package scripts eg.: `test, build, lint`

```shell
yarn workspace @sensenet/redux test
```

There are aliases for the example applications like dms, component-docs, sn-app.
You can run any command in these packages easily.

```shell
yarn dms build:webpack
yarn dms start
yarn snapp start
yarn storybook start
```

### Running e2e tests locally

Cypress is installed to dms-demo app right now. To run the tests you simply need to run `yarn test:dms:e2e`
To develop e2e tests:

- You need a running instance of dms (`yarn start:dms:e2e`) with NODE_ENV set to test
- Start cypress with `yarn cypress open -P examples/sn-dms-demo` in another command prompt
- Add test to `examples/sn-dms-demo/cypress/integration` with a spec.ts | spec.js file extension

Running the tests locally will create a currentUser.json with a new test user. The tests are going to use this user.
In order to use another user, you can change the email and password of the current user or let the system create a new for you by deleting the JSON.
