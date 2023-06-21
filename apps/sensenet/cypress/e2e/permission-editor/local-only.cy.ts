import { pathWithQueryParams } from '../../../src/services/query-string-builder'

describe('LocalOnly permission setting', () => {
  before(() => {
    cy.login()
    cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
  })

  it('creates a new permsission entry', () => {
    cy.get('[data-test="drawer-menu-item-content"]').click()
    cy.get('[data-test="menu-item-sample-workspace"]').rightclick()
    cy.get('[data-test="content-context-menu-setpermissions"]').click()
    cy.get('[data-test="set-on-this-developer-dog"]').click()
    cy.get('[data-test="permission-item-see"]').should('be.visible')
    cy.get('[data-test="switcher-full-access"]').should('be.visible').click()
    cy.get('[data-test="switcher-local-only"]').should('be.visible').click()
    cy.get('[data-test="permission-item-see"]').should('be.visible').click()
    cy.get('[data-test="permission-editor-submit"]').click()
    cy.get('[data-test="set-on-this-developer-dog"]').should('exist')
    cy.get('[data-test="set-on-this-developer-dog-local-only"]').should('exist')
  })

  it('reverting removes the localonly entry from the list', () => {
    cy.get('[data-test="set-on-this-developer-dog-local-only"]').click()
    cy.get('[data-test="permission-item-see"]').find('[data-test="undefined"]').should('be.visible').click()
    cy.get('[data-test="switcher-local-only"]').should('be.visible')
    cy.get('[data-test="permission-editor-submit"]').click()
    cy.get('[data-test="set-on-this-developer-dog"]').should('exist')
    cy.get('[data-test="set-on-this-developer-dog-local-only"]').should('not.exist')
  })
})
