# Contribution guide for End-to-End testing

This guide is about how to write and run End-to-End (E2E) tests for a feature or a component in sensenet's admin ui. We are using Cypress for E2E testing, if you are not familiar with it, check the following docs to get started:

- [Developer Guide](https://docs.cypress.io/guides/overview/why-cypress.html)
- [API Reference](https://docs.cypress.io/api/api/table-of-contents.html)

## How to run E2E tests on your local machine

Check out and pull the actual develop branch to your local machine (If you didn't clone sn-client repository yet than you should do it first) (command: `git checkout develop && git pull`)

If you would like to [create new test or modify an existing one](https://github.com/SenseNet/sensenet/blob/master/CONTRIBUTING.md#making-a-change) please always create a new branch. (command: `git checkout -b <new_branch_name>`)

Go to apps/sensenet folder (command: `cd apps/sensenet`)

Install all necessary dependencies (command: `yarn install`)

Change the apps/sensenet/cypress.json env configuration to yours. (You can read more about in the Configuration chapter)

There are two possible ways to run end-to-end tests:

- **Running in the background: //eq.: cypress run** (command: `yarn cypress:all`)

  This command will run the tests with a headless browser (Electron). You can use any [run options](https://docs.cypress.io/guides/guides/command-line.html#cypress-run) what cypress supports.

- **Open with Cypress Test Runner: //eq.: cypress open** (command: `yarn cypress`)

  This command will open the [Cypress Test Runner](https://docs.cypress.io/guides/core-concepts/test-runner.html#Overview) where you can easily select test what you would like to run and follow the result of the test runs. Here you can also use [run options](https://docs.cypress.io/guides/guides/command-line.html#cypress-open) if you want.

## Folder and file structure

The folder structure is based on Cypress' initials:

```
|-- cypress
  |-- fixtures
  |-- integration
  |-- plugins
  |-- support
  |-- tsconfig.json
|-- cypress.json
```

1. /cypress/fixtures is for [fixture files](https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests.html#Fixture-Files):
   Fixtures are used as external pieces of static data that can be used by tests.
   You would typically use them with the `cy.fixture()` command and most often when you’re stubbing Network Requests.
2. /cypress/integration is for [test files](https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests.html#Test-files):
   To start writing tests, simply create a new file (e.g. login.spec.ts) within /e2e/cypress/integration folder and;
   refresh tests list in the Cypress Test Runner and a new file should have appeared in the list.
3. /cypress/plugins is for [plugin files](https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests.html#Plugin-files)
4. /cypress/support is for [support files](https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests.html#Support-file)
   The support file is a great place to put reusable behavior such as custom commands or global overrides that you want applied and available to all of your spec files.
5. /cypress.json is for Cypress configuration.

## Configurations

As it is mentioned above the Cypress related configurations are stored in the cypress.json file. Let's check the settings that are sensenet specifics.

- `baseUrl`: This one is to set the url of the site or app that should be tested, in our case it is by default set to the test version of the admin surface (built from the develop branch of sn-client repository so it is not a stable and released version, should be used only for test purposes) ([admin.test.sensenet.com](https://admin.test.sensenet.com)).

- `env`: Things grouped into this object specifies the test environments (repository and Identity Server) and test users.

  - `repoUrl`: Url of the connected repository (e2e-service.test.sensenet.com), which is a separate enviroment made for testing purposes only. You should change this url to your repository url.

  - `identityServer`: Url of the connected Identity Server (is.demo.sensenet.com), which is a separate enviroment made for testing purposes only.
    You should change this url to your dedicated identity server url.

  - `users`:

    ```
      "admin": {
        "clientId": "kitty",
        "clientSecret": "<your secret key for admin role>",
        "id": "/Root/IMS/Public('businesscat')"
      },
      "developer": {
        "clientId": "devdog",
        "clientSecret": "<your secret key for developer role>",
        "id": "/Root/IMS/Public('devdog')"
      },
      "editor": {
        "clientId": "eddie",
        "clientSecret": "<your secret key for editor role>",
        "id": "/Root/IMS/Public('editormanatee')"
      }
    ```

    These are the rolse what you can use for testing pusposes. In every test case we indicated in what role the particular test should be run. You can find the secret keys for the roles on your [profile page](https://profile.sensenet.com/) after login.

## What requires an E2E Test?

- Test case issues in [sn-client Github repository](https://github.com/SenseNet/sn-client) marked with the **labels** test and **hacktoberfest**. There's also a dedicated board for Hacktoberfest issues [here](https://github.com/orgs/SenseNet/projects/7).

## Interested in Contributing to E2E Testing through Help Wanted Tickets

- Look for issues on the dedicated [board](https://github.com/orgs/SenseNet/projects/7).
- Each issue contains the specific test steps and acceptances that need to be accomplished as a minimum requirement. Additional steps and assertions for robust test implementation are welcome.
- Join our dedicated channel on gitter and talk to our development team, collaborate and learn.

# Guide for writing E2E tests for sensenet's admin surface

## Where should I place my tests?

Tests should be placed in the cypress/integration folder. Cypress is configured to look for and run tests that match the pattern of \*\.spec.ts, so if you are creating a new test make sure to name it something like my_new_test.spec.ts to ensure that it gets picked up.

Before creating a new \*\.spec.ts file, look to see if there is already one for testing the same or similar feature what you are testing, it can be very likely that you can add additional tests to a pre-existing file.

## Writing specs

1. Check the steps of the test case in the chosen issue these will be the base of your specs since they're containing the prerequsities, acceptances and everything else you need to start with writing an e2e test for sensenet admin ui.

2. Check the existing specs in the folders under integration and try to write yours the similar way.

```javascript
describe('User handling', () => {
  before(() => cy.clearCookies({ domain: null } as any))

  it('should login with test user', () => {
    cy.visit('/')
    cy.get('input[name="repository"]').type(`${Cypress.env('repoUrl')}{enter}`)

    cy.get('[data-test="demo-button"]').click()
  })

  it('should logout', () => {
    cy.login()
    cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
      .get('.MuiToolbar-root .MuiAvatar-root+.MuiButtonBase-root.MuiIconButton-root')
      .click()
      .get('.MuiList-root li[role="menuitem"]')
      .contains('Log out')
      .click()

    cy.get('.MuiDialog-container .MuiDialogActions-root .MuiButton-containedPrimary').click()
  })
})
```

3. If you stucked somewhere, feel free to ask questions on the issue that you're assigned to or in sensenet's [dedicated gitter channel](https://gitter.im/SenseNet/SNaaS).

## Reusable tools and snippets

As of now we implemented the login command for you to make implementing tests easier. You can find this command under apps/sensenet/cypress/support/commands.js file but feel free to extend the list of [reuseable commands](https://docs.cypress.io/api/cypress-api/custom-commands.html).

You can use the login command in your tests with an argument as your role you want to use:

```javascript
cy.login('developer')
```

If no argument added then login will be done with admin role.
