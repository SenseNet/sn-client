# Contribution guide for End-to-End testing

This guide is about how to write and run End-to-End (E2E) tests for a feature or a component in sensenet's admin ui. We are using Cypress for E2E testing, if you are not familiar with it, check the following docs to get started:

- [Developer Guide](https://docs.cypress.io/guides/overview/why-cypress.html)
- [API Reference](https://docs.cypress.io/api/api/table-of-contents.html)

## How to run E2E tests on your local machine

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

## What requires an E2E Test?

- Test case issues in [sn-client Github repository](https://github.com/SenseNet/sn-client) marked with the **labels** test and **hacktoberfest**. There's also a dedicated board for Hacktoberfest issues [here](https://github.com/orgs/SenseNet/projects/7).

## Interested in Contributing to E2E Testing through Help Wanted Tickets

- Look for issues on the dedicated [board](https://github.com/orgs/SenseNet/projects/7).
- Each issue contains the specific test steps and acceptances that need to be accomplished as a minimum requirement. Additional steps and assertions for robust test implementation are welcome.
- Join our dedicated channel on gitter and talk to our development team, collaborate and learn.

# Guide for writing E2E tests for sensenet's admin surface

## Where should I place my tests?

Tests should be placed in the cypress/integration folder. Cypress is configured to look for and run tests that match the pattern of \*\_spec.js, so if you are creating a new test make sure to name it something like my_new_test_spec.js to ensure that it gets picked up.

Before creating a new \*\_spec.js file, look to see if there is already one for testing the same or similar feature what you are testing, it can be very likely that you can add additional tests to a pre-existing file.

## Writing specs

## Reusable tools and snippets
