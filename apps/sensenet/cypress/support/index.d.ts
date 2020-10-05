/// <reference types="cypress" />
/// <reference types="cypress-xpath/src" />

declare namespace Cypress {
  type UserTypes = 'developer' | 'admin'

  interface Chainable {
    /**
     * Custom command to log in programmatically.
     */
    login(userType?: UserTypes): void
  }
}
