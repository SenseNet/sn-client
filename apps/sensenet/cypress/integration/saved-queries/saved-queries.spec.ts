import { pathWithQueryParams } from '../../../src/services/query-string-builder'

describe('Saved queries', () => {
  before(() => {
    cy.login()
    cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
  })
  it('saving a query should work properly.', () => {
    const inputText = "+InFolder:'/Root/Content/IT/Document_Library'"
    cy.get('[data-test="drawer-menu-item-Search"]').click()
    cy.get('a[title="New search"]').click()
    cy.get('[data-test="input-search"]').type(inputText)
    cy.get('[data-test="table-cell-Chicago"]').should('be.visible')
    cy.get('[data-test="table-cell-Munich"]').should('be.visible')
    cy.get('button[aria-label="Save Query"]')
      .click()
      .then(() => {
        cy.get('div[role="dialog"]').find('input[type="text"]').clear().type('test query for IT Doclib')
        cy.get('div[role="dialog"]').find('button[aria-label="Save"]').click()
        cy.get('[data-test="drawer-menu-item-Search"]')
          .click()
          .then(() => {
            cy.get('[data-test="table-cell-test query for IT Doclib"]').should('be.visible')
          })
        cy.get('[data-test="table-cell-test query for IT Doclib"]').dblclick()
        cy.get('[data-test="input-search"]').find('input[type="text"]').should('have.value', inputText)

        cy.get('[data-test="table-cell-Chicago"]').should('be.visible')
        cy.get('[data-test="table-cell-Munich"]').should('be.visible')
      })
  })
  it('delete of a saved query should work properly.', () => {
    cy.get('[data-test="drawer-menu-item-Search"]').click()
    cy.get('[data-test="table-cell-test query for IT Doclib"]')
      .rightclick()
      .then(() => {
        cy.get('[data-test="content-context-menu-delete"]')
          .click()
          .then(() => {
            cy.get('[data-test="delete-permanently"]').click()
            cy.get('button[aria-label="Delete"]').click()
            cy.get('h6').should('have.text', 'There is no query saved yet.')
            cy.get('[data-test="table-cell-test query for IT Doclib"]').should('not.be.visible')
          })
      })
  })
})
