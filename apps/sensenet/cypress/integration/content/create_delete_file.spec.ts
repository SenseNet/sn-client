import { pathWithQueryParams } from '../../../src/services/query-string-builder'

const fileName = `TestFile`
const newFileName = `Changed${fileName}`

describe('Create/Delete content', () => {
  before(() => {
    cy.login()
    cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
  })
  it('Creating a new file should work properly', () => {
    cy.get('[data-test="drawer-menu-item-content"]').click()
    cy.get('[data-test="menu-item-it-workspace"]').click()
    cy.get('[data-test="menu-item-document-library"]').click({ force: true })
    cy.get('[data-test="add-button"]').click()
    cy.get('[data-test="listitem-file"]')
      .click()
      .then(() => {
        cy.get('#Name').type(fileName)
        cy.contains('Submit').click()
        cy.get('[data-test="snackbar-close"]').click()
        cy.get(`[data-test="table-cell-${fileName.replace(/\s+/g, '-').toLowerCase()}"]`).should('have.text', fileName)
      })
  })

  it('File should be edited', () => {
    cy.get('[data-test="drawer-menu-item-content"]').click()
    cy.get('[data-test="menu-item-it-workspace"]').click()
    cy.get('[data-test="menu-item-document-library"]').click({ force: true })
    cy.get(`[data-test="table-cell-${fileName.replace(/\s+/g, '-').toLowerCase()}"]`).rightclick()
    cy.get('[data-test="content-context-menu-edit"]')
      .click()
      .then(() => {
        cy.get('#Name').clear().type(newFileName)
        cy.contains('Submit').click()
        cy.get('[data-test="snackbar-close"]').click()
        cy.get(`[data-test="table-cell-${newFileName.replace(/\s+/g, '-').toLowerCase()}"]`).should(
          'have.text',
          newFileName,
        )
        cy.get(`[data-test="table-cell-${fileName.replace(/\s+/g, '-').toLowerCase()}"]`).should('not.exist')
      })
  })

  it('File delete should work properly', () => {
    cy.get('[data-test="drawer-menu-item-content"]').click()
    cy.get('[data-test="menu-item-it-workspace"]').click()
    cy.get('[data-test="menu-item-document-library"]').click({ force: true })
    cy.get(`[data-test="table-cell-${newFileName.replace(/\s+/g, '-').toLowerCase()}"]`).rightclick()
    cy.get('[data-test="content-context-menu-delete"]')
      .click()
      .then(() => {
        cy.get('[data-test="delete-permanently"]').click()
        cy.get('button[aria-label="Delete"]').click()
        cy.get('[data-test="snackbar-close"]').click()
        cy.get(`[data-test="table-cell-${fileName.replace(/\s+/g, '-').toLowerCase()}"]`).should('not.exist')
      })
  })
})
