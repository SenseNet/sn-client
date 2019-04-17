import { Repository } from '@sensenet/client-core'

declare global {
  interface Window {
    repository: Repository
  }
  namespace Cypress {
    interface Chainable {
      login: (email: string, password: string) => void
      registerUser: (email: string, password: string) => void
    }
  }
}
