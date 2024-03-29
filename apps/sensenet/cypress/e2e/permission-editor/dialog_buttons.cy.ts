import { pathWithQueryParams } from '../../../src/services/query-string-builder'

describe('Permission editor dialog buttons', () => {
  before(() => {
    cy.login()
    cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
  })

  it('opens the permission editor dialog and clicking on Submit closes it', () => {
    cy.get('[data-test="drawer-menu-item-content"]').click()
    cy.get('[data-test*="-workspace"]').eq(0).rightclick()
    cy.get('[data-test="content-context-menu-setpermissions"]').click()
    cy.get('[data-test*="set-on-this-administrators"]').click()

    cy.get('[data-test="permission-dialog-title"]').should('contain.text', '/Root/IMS/Public/Administrators')
    cy.get('[data-test="permission-editor-submit"]').click()
    cy.get('[data-test="permission-dialog-title"]').should('not.exist')
  })

  it('opens the permission editor dialog and clicking on Cancel closes it', () => {
    cy.get('[data-test="permission-inherited-list"]').click()
    cy.get('[data-test="inherited-editors"]').click()
    cy.get('[data-test="permission-dialog-title"]').should('have.text', 'Editors/Root/IMS/Public/Editors')
    cy.get('[data-test="permission-editor-cancel"]').click()
    cy.get('[data-test="permission-dialog-title"]').should('not.exist')
  })
})
