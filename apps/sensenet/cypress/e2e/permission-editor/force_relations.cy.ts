import { pathWithQueryParams } from '../../../src/services/query-string-builder'

describe('Permission editor group switcher and force relations', () => {
  before(() => {
    cy.login()
    cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
  })

  it('switching a group switcher influences the permission items', () => {
    cy.get('[data-test="drawer-menu-item-content"]').click()
    cy.get('[data-test*="-workspace"]').eq(0).rightclick()
    cy.get('[data-test="content-context-menu-setpermissions"]').click()
    cy.get('[data-test="set-on-this-administrators"]').click()
    cy.get('[data-test="switcher-read"]').should('be.visible').click()

    cy.checkReadPermissionGroup(false)

    cy.get('[data-test="permission-editor-submit"]').click()
  })

  it('force relations should work properly', () => {
    cy.get('[data-test="drawer-menu-item-content"]').click()
    cy.get('[data-test="menu-item-it-workspace"]').rightclick()
    cy.get('[data-test="content-context-menu-setpermissions"]').click()
    cy.get('[data-test="set-on-this-visitors"]').click()

    cy.checkReadPermissionGroup(false)

    cy.get('[data-test="switcher-open"]').should('be.visible').click()

    cy.checkReadPermissionGroup(true)

    cy.get('[data-test="permission-editor-submit"]').click()
  })
})
