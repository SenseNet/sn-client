import { Repository } from '@sensenet/client-core'
import { User } from '@sensenet/default-content-types'

declare global {
  interface Window {
    repository: Repository
  }
  namespace Cypress {
    interface Chainable {
      login: (email: string, password: string) => Cypress.Chainable<boolean>
      registerUser: (email: string, password: string) => Cypress.Chainable<User>
    }
  }
}
