import { pathWithQueryParams } from '../../../src/services/query-string-builder'

describe('Permission editor - public/private content', () => {
  before(() => {
    cy.login()
    cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
  })

  it('Make content public should work properly', () => {
    cy.get('[data-test="drawer-menu-item-content"]').click()
    cy.get('[data-test="menu-item-it-workspace"]').rightclick()
    cy.get('[data-test="content-context-menu-setpermissions"]').click()

    cy.get('[data-test="make-content-public-or-private"]').click()
    cy.get('[data-test="set-on-this-visitor"]').should('be.visible')
  })

  it('Make content private should work properly', () => {
    cy.get('[data-test="make-content-public-or-private"]').click()
    cy.get('[data-test="set-on-this-visitor"]').should('not.exist')
  })
})
