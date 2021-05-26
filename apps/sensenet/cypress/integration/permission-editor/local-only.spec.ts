import { pathWithQueryParams } from '../../../src/services/query-string-builder'

describe('LocalOnly permission setting', () => {
  before(() => {
    cy.login()
    cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
  })

  it('creates a new permsission entry', () => {
    cy.get('[data-test="drawer-menu-item-content"]').click()
    cy.get('[data-test="menu-item-it-workspace"]').rightclick()
    cy.get('[data-test="content-context-menu-setpermissions"]').click()
    cy.get('[data-test="set-on-this-visitors"]').click()
    cy.get('[data-test="switcher-see"]').should('be.visible')
    cy.get('[data-test="switcher-full-access"]').should('be.visible').click()
    cy.get('[data-test="switcher-full-access"]').should('be.visible').click()
    cy.get('[data-test="switcher-local-only"]').should('be.visible').click()
    cy.get('[data-test="switcher-see"]').should('be.visible').click()
    cy.get('[data-test="permission-editor-submit"]').click()
    cy.get('[data-test="set-on-this-visitors"]').should('exist')
    cy.get('[data-test="set-on-this-visitors-local-only"]').should('exist')
  })

  it('reverting removes the localonly entry from the list', () => {
    cy.get('[data-test="set-on-this-visitors-local-only"]').click()
    cy.get('[data-test="switcher-see"]').should('be.visible').click()
    cy.get('[data-test="permission-editor-submit"]').click()
    cy.get('[data-test="set-on-this-visitors"]').should('exist')
    cy.get('[data-test="set-on-this-visitors-local-only"]').should('not.exist')
  })
})
