/// <reference types="cypress" />
/// <reference types="cypress-xpath/src" />

declare namespace Cypress {
  type UserTypes = 'developer' | 'admin'

  interface Chainable {
    /**
     * Custom command to log in programmatically.
     */
    login(userType?: UserTypes): void

    /**
     * Save the current value of local storage to memory
     */
    saveLocalStorage(): void

    /**
     * Restore a previously saved local storage value from memory
     */
    restoreLocalStorage(): void
  }
}
