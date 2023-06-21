import { PATHS, resolvePathParams } from '../../../src/application-paths'
import { pathWithQueryParams } from '../../../src/services/query-string-builder'

describe('Permission editor - public/private content', () => {
  before(() => {
    cy.login()
    cy.visit(
      pathWithQueryParams({
        path: resolvePathParams({ path: PATHS.content.appPath, params: { browseType: 'explorer' } }),
        newParams: { repoUrl: Cypress.env('repoUrl'), path: '/SampleWorkspace/Blog' },
      }),
    )
  })

  it('Make content public should work properly', () => {
    cy.get('[data-test="menu-item-blog"]').rightclick({ force: true })

    cy.get('[data-test="content-context-menu-setpermissions"]').click()

    cy.get('[data-test="make-content-public-or-private"]').click()
    cy.get('[data-test="set-on-this-visitor"]').should('be.visible')
  })

  it('Make content private should work properly', () => {
    cy.get('[data-test="make-content-public-or-private"]').click()
    cy.get('[data-test="set-on-this-visitor"]').should('not.exist')
  })
})
