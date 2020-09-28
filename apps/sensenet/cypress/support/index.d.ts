/// <reference types="cypress" />
/// <reference types="cypress-xpath/src" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to log in programmatically.
     */
    login(): void
  }
}
