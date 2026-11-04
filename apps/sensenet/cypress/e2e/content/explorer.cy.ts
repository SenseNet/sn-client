import { pathWithQueryParams } from '../../../src/services/query-string-builder'

describe('Column settings', () => {
  before(() => {
    cy.login('superAdmin')
    cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
    cy.viewport(1340, 890)
  })

  it('It should open Content Explorer and change the Columns', () => {
    cy.get('[data-test="drawer-menu-item-content"]').click()
    cy.get('[data-test="column-settings"]').click()
    cy.get('[data-test="column-settings-source"]').should('be.visible')

    cy.get('[data-test="column-settings-field-search"]').type('CreationDate')
    cy.get('[role="option"]').should('contain', 'Creation Date').and('contain', 'CreationDate')
    cy.get('[data-test="column-settings-field-search"]').type('{esc}').clear()

    const dataTransfer = new DataTransfer()
    cy.get('[data-test="column-settings-drag-availablecontenttypefields"]').trigger('dragstart', { dataTransfer })
    cy.get('[data-test="column-settings-row-displayname"]')
      .trigger('dragover', { dataTransfer })
      .trigger('drop', { dataTransfer })
    cy.get('[data-test^="column-settings-row-"]')
      .first()
      .should('have.attr', 'data-test', 'column-settings-row-availablecontenttypefields')

    cy.get('[data-test="column-settings-drag-displayname"]').trigger('dragstart', { dataTransfer })
    cy.get('[data-test="column-settings-row-availablecontenttypefields"]')
      .trigger('dragover', { dataTransfer })
      .trigger('drop', { dataTransfer })

    cy.get('[data-test="column-settings-row-displayname"] input').clear().type('Test Display')
    cy.get('[data-test="column-settings-row-availablecontenttypefields"] input').clear().type('Test')
    cy.get('[data-test="column-settings-save"]').click()

    cy.get('.ag-header-cell[col-id="Actions"]').should('be.visible').should('not.contain', 'Actions')
    cy.get('[data-test="column-settings"]').should('be.visible')
    cy.get('.ag-header-cell[col-id="AvailableContentTypeFields"]').should('be.visible').contains('Test')
    cy.get('.ag-header-cell[col-id="DisplayName"]').should('be.visible').contains('Test Display')

    cy.get('[data-test="column-settings"]').click()
    cy.get('[data-test="column-settings-row-displayname"] input').clear().type('Display Name')
    cy.get('[data-test="column-settings-row-availablecontenttypefields"] input')
      .clear()
      .type('Available Content Type Fields')
    cy.get('[data-test="column-settings-save"]').click()
  })
})
