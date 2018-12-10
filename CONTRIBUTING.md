# How to contribute

Thank you for checking out our project! :star2: :sunny: :deciduous_tree: :earth_americas:

Please visit the [contribution guide](https://github.com/SenseNet/sensenet/blob/master/CONTRIBUTING.md) in our main repository for advices on how to help the community.

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
4.  `yarn build` this will run the build script in every package
5.  `yarn test`

#### Bootstrapping everything

_This method is slow_

1.  `yarn`
2.  Have a beer 🍺
3.  `yarn build` (to verify everything worked)

#### Running package script

With yarn you can run the any package scripts eg.: `test, build, lint`

```shell
yarn workspace @sensenet/redux test
```
