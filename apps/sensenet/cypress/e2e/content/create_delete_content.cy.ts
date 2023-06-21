import { pathWithQueryParams } from '../../../src/services/query-string-builder'

const folderName = `TestFolder`

describe('Create/Delete content', () => {
  before(() => {
    cy.login()
    cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
  })
  it('Creating a new folder should work properly', () => {
    cy.get('[data-test="drawer-menu-item-content"]').click()
    cy.get('[data-test="menu-item-sample-workspace"]').click()
    cy.get('[data-test="add-button"]').click()
    cy.get('[data-test="listitem-folder"]')
      .click()
      .then(() => {
        cy.get('#DisplayName').type(folderName)
        cy.get('#Name').type(folderName)
        cy.contains('Submit').click()
        cy.get('[data-test="snackbar-close"]').click()
        cy.get(`[data-test="table-cell-${folderName.replace(/\s+/g, '-').toLowerCase()}"]`).should(
          'have.text',
          folderName,
        )
      })
  })

  it('Folder delete should work properly', () => {
    cy.get('[data-test="drawer-menu-item-content"]').click()
    cy.get('[data-test="menu-item-sample-workspace"]').click()
    cy.get(`[data-test="table-cell-${folderName.replace(/\s+/g, '-').toLowerCase()}"]`).rightclick({ force: true })
    cy.get('[data-test="content-context-menu-delete"]')
      .click()
      .then(() => {
        cy.get('[data-test="delete-permanently"]').click()
        cy.get('button[aria-label="Delete"]').click()
        cy.get('[data-test="snackbar-close"]').click()
        cy.get(`[data-test="table-cell-${folderName.replace(/\s+/g, '-').toLowerCase()}"]`).should('not.exist')
      })
  })
})
