import { pathWithQueryParams } from '../../../src/services/query-string-builder'

const newColumnSettings = {
  columns: [
    { field: 'DisplayName', title: 'Test Display' },
    { field: 'AvailableContentTypeFields', title: 'Test' },
  ],
}

const originalColumnSettings = {
  columns: [
    { field: 'DisplayName', title: 'Display Name' },
    { field: 'AvailableContentTypeFields', title: 'Available Content Type Fields' },
  ],
}

describe('Add new permission entry', () => {
  before(() => {
    cy.login('superAdmin')
    cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
    cy.viewport(1340, 890)
  })

  it('It should open Content Explorer and change the Columns', () => {
    cy.get('[data-test="drawer-menu-item-content"]').click()
    cy.get('[data-test="column-settings"]').click()

    cy.get('.react-monaco-editor-container textarea')
      .type('{ctrl}a', { force: true })
      .clear({ force: true })
      .type(JSON.stringify(newColumnSettings), {
        parseSpecialCharSequences: false,
      })

    cy.get('[data-test="monaco-editor-submit"]').click()

    cy.get('[data-test="table-header-actions"]').should('be.visible').find('.MuiButtonBase-root').contains('Action')
    cy.get('[data-test="table-header-availablecontenttypefields"]')
      .should('be.visible')
      .find('.MuiButtonBase-root')
      .contains('Test')
    cy.get('[data-test="table-header-displayname"]')
      .should('be.visible')
      .find('.MuiButtonBase-root')
      .contains('Test Display')

    cy.get('[data-test="column-settings"]').click()

    cy.get('.react-monaco-editor-container textarea')
      .type('{ctrl}a', { force: true })
      .clear({ force: true })
      .type(JSON.stringify(originalColumnSettings), {
        parseSpecialCharSequences: false,
      })
    cy.get('[data-test="monaco-editor-submit"]').click()
  })
})
