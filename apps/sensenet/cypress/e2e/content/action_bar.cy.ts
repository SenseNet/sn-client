import { PATHS, resolvePathParams } from '../../../src/application-paths'
import { pathWithQueryParams } from '../../../src/services/query-string-builder'

describe('Action bar testing', () => {
  beforeEach(() => {
    cy.login()
    cy.visit(
      pathWithQueryParams({
        path: resolvePathParams({ path: PATHS.content.appPath, params: { browseType: 'explorer' } }),
        newParams: { repoUrl: Cypress.env('repoUrl'), path: '/SampleWorkspace/Document_Library' },
      }),
    )
  })

  it('should edit button show in action bar', () => {
    cy.get('[data-test="menu-item-document-library"]').rightclick({ force: true })
    cy.get('[data-test="content-context-menu-browse"]').click()
    cy.get('[data-test="viewtitle-edit"]').should('be.visible').click()
    cy.get('[data-test="viewtitle-details"]').should('be.visible').click()
    cy.get('[data-test="viewtitle-edit"]').should('be.visible')
  })
})
