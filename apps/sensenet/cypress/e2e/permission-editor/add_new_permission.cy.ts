import { pathWithQueryParams } from '../../../src/services/query-string-builder'

describe('Add new permission entry', () => {
  before(() => {
    cy.login('superAdmin')
    cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
  })

  it('opens a new dialog', () => {
    cy.viewport(1840, 890)
    cy.get('[data-test="drawer-menu-item-content"]').click()
    cy.get('[data-test*="-workspace"]').eq(0).rightclick()
    cy.get('[data-test="content-context-menu-setpermissions"]').click()
    cy.get('[data-test="assign-new-permission"]').click()
    cy.get('[data-test="member-select-dialog"]').should('contain.text', 'New permission entry')

    cy.get('[data-test="reference-input"]').type('developers')
    cy.get('[data-test="suggestion-developers"]').eq(0).click()
    cy.get('[data-test="member-select-add"]').click({ force: true })
    cy.get('[data-test="set-on-this-developer-dog"]').should('exist')
    cy.get('[data-test="permission-dialog-title"]').should('contain.text', 'Developer')
    cy.get('[data-test="permission-editor-cancel"]').click()
    cy.get('[data-test="set-on-this-developer-dog"]').should('not.exist')
    cy.get('[data-test="permission-dialog-title"]').should('not.exist')
  })
})
