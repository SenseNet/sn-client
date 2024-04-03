import { PATHS, resolvePathParams } from '../../../src/application-paths'
import { pathWithQueryParams } from '../../../src/services/query-string-builder'

describe('Users enabled field', () => {
  before(() => {
    cy.login()
    cy.visit(
      pathWithQueryParams({
        path: resolvePathParams({ path: PATHS.usersAndGroups.appPath, params: { browseType: 'explorer' } }),
        newParams: { repoUrl: Cypress.env('repoUrl'), path: '/Public' },
      }),
    )
  })
  it('Disabled state should work properly', () => {
    cy.get('[data-test="switcher-developer-dog"]').click()
    cy.get('[data-test="table-cell-developer-dog"]').dblclick()
    cy.get('[data-test="viewtitle"]').should('be.visible')
    cy.get('.MuiSwitch-root').find('.MuiSwitch-input').first().should('not.be.checked')
    cy.get('[data-test="cancel"]').click()
  })
  it('Enabled state should work properly', () => {
    cy.get('[data-test="switcher-developer-dog"]').click()
    cy.get('[data-test="table-cell-developer-dog"]').dblclick({ force: true })
    cy.get('[data-test="viewtitle"]').should('be.visible')
    cy.get('.MuiSwitch-root').find('.MuiSwitch-input').first().should('be.checked')
    cy.get('[data-test="cancel"]').click()
  })
})
