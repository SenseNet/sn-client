import { Content, Repository, UploadFileOptions, UploadResponse } from '@sensenet/client-core'
import { User } from '@sensenet/default-content-types'
import { Omit } from 'cypress/types/lodash'

declare global {
  interface Window {
    repository: Repository
  }
  namespace Cypress {
    interface Chainable {
      login: (email: string, password: string) => Cypress.Chainable<boolean>
      registerUser: (email: string, password: string) => Cypress.Chainable<User>
      uploadWithApi: (options: UploadOptions) => Cypress.Chainable<UploadResponse>
    }
  }
}

export type UploadOptions = Partial<Omit<UploadFileOptions<Content>, 'file'>> & { fileName: string }
