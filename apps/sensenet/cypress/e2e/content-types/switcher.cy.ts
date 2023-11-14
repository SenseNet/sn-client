import { PATHS, resolvePathParams } from '../../../src/application-paths'
import { pathWithQueryParams } from '../../../src/services/query-string-builder'

const contextMenuItems = ['browse', 'copyto', 'edit', 'moveto', 'delete']
describe('Groups', () => {
  before(() => {
    cy.login()
    cy.visit(
      pathWithQueryParams({
        path: resolvePathParams({ path: PATHS.contentTypes.appPath, params: { browseType: 'explorer' } }),
        newParams: { repoUrl: Cypress.env('repoUrl') },
      }),
    )
    //cy.get('[data-test="groups"]').click()
  })
  it('Switch should reveal hidden types', () => {
    cy.get('[data-test="table-cell-application"]').should('not.exist')
    cy.get('[data-test="hidden-type-switch"]')
      .click()
      .then(() => {
        cy.get('[data-test="table-cell-application"]').should('exist')
      })
  })
})
