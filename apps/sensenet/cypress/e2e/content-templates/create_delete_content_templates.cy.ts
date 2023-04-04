import { pathWithQueryParams } from '../../../src/services/query-string-builder'

const templeteName = 'Test template'

describe('Create/Delete content', () => {
  before(() => {
    cy.login()
    cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
  })
  it('Creating a new folder should work properly', () => {
    cy.get('[data-test="drawer-menu-item-content-templates"]').click()

    cy.intercept(/ContentTemplates\?/).as('ContentTemplates')

    cy.wait('@ContentTemplates').then(({ response }) => {
      cy.get('[data-test="add-button"]').click()
      cy.get('[data-test="listitem-email-template"]')
        .click()
        .then(() => {
          cy.get('#Name').type(templeteName)
          cy.contains('Submit').click()
          cy.get('[data-test="snackbar-close"]').click()
          cy.get(`[data-test="table-cell-${templeteName.replace(/\s+/g, '-').toLowerCase()}"]`).should(
            'have.text',
            templeteName,
          )
        })
    })
  })

  it('Folder delete should work properly', () => {
    cy.get('[data-test="drawer-menu-item-content-templates"]').click()
    cy.get(`[data-test="table-cell-${templeteName.replace(/\s+/g, '-').toLowerCase()}"]`).rightclick()
    cy.get('[data-test="content-context-menu-delete"]')
      .click()
      .then(() => {
        cy.get('[data-test="delete-permanently"]').click()
        cy.get('button[aria-label="Delete"]').click()
        cy.get('[data-test="snackbar-close"]').click()
        cy.get(`[data-test="table-cell-${templeteName.replace(/\s+/g, '-').toLowerCase()}"]`).should('not.exist')
      })
  })
})
