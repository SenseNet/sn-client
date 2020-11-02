import { pathWithQueryParams } from '../../../src/services/query-string-builder'

describe('Upload', () => {
  before(() => {
    cy.login()
    cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
  })

  it('uploading a file/content should works properly', () => {
    const fileToBeUploaded = 'data.json'
    cy.get('[data-test="drawer-menu-item-Content"]').click()
    cy.get('[data-test="menu-item-IT Workspace"]').click()
    cy.get('[data-test="menu-item-Document library"]').click({ force: true })
    cy.get('[data-test="add-button"]')
      .click()
      .then(() => {
        cy.get('div[title="Upload"]').click()
        cy.get('[data-test="input-file"]').attachFile(fileToBeUploaded)
        cy.get(`[data-test="btn-upload"]`)
          .click()
          .then(() => {
            cy.get('div[role="progressbar"]').should('have.text', 'Upload completed')
            cy.get('[data-test="dialog-close"]').click()

            cy.get(`[data-test="table-cell-${fileToBeUploaded}"]`).should('have.text', fileToBeUploaded)

            cy.get(`[data-test="table-cell-${fileToBeUploaded}"]`).rightclick()
            cy.get('[data-test="content-context-menu-delete"]')
              .click()
              .then(() => {
                cy.get('[data-test="delete-permanently"]').click()
                cy.get('button[aria-label="Delete"]').click()
                cy.get(`[data-test="table-cell-${fileToBeUploaded}"]`).should('not.exist')
              })
          })
      })
  })
})
