import { pathWithQueryParams } from '../../../src/services/query-string-builder'

describe('Saved queries', () => {
  before(() => {
    cy.login()
    cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
    cy.viewport(1000, 800)
  })
  it('saving a query should work properly.', () => {
    const inputText = 'Sample'
    cy.get('[data-test="drawer-menu-item-search"]').click()
    cy.get('a[title="New search"]').click()
    cy.get('[data-test="input-search"]').type(inputText)

    cy.get('[data-test="table-cell-sample-workspace"]').should('be.visible')
    cy.get('[data-test="table-cell-sample-link"]').should('be.visible')
    cy.get('[data-test="table-cell-sample-memo"]').should('be.visible')
    cy.get('[data-test="table-cell-sample-task"]').should('be.visible')
    cy.get('[data-test="table-cell-sample-event"]').should('be.visible')

    cy.get('button[aria-label="Save Query"]')
      .click()
      .then(() => {
        cy.get('div[role="dialog"]').find('input[type="text"]').clear().type('test search for a keyword')
        cy.get('div[role="dialog"]').find('button[aria-label="Save"]').click()
        cy.get('[data-test="drawer-menu-item-search"]')
          .click()
          .then(() => {
            cy.get('[data-test="table-cell-test-search-for-a-keyword"]').should('be.visible')
          })
        cy.get('[data-test="table-cell-test-search-for-a-keyword"]').dblclick()
        cy.get('[data-test="input-search"]').find('input[type="text"]').should('have.value', inputText)

        cy.get('[data-test="table-cell-sample-workspace"]').should('be.visible')
        cy.get('[data-test="table-cell-sample-link"]').should('be.visible')
        cy.get('[data-test="table-cell-sample-memo"]').should('be.visible')
        cy.get('[data-test="table-cell-sample-task"]').should('be.visible')
        cy.get('[data-test="table-cell-sample-event"]').should('be.visible')
      })
  })
  it('delete of a saved query should work properly.', () => {
    cy.get('[data-test="drawer-menu-item-search"]').click()
    cy.get('[data-test="table-cell-test-search-for-a-keyword"]')
      .rightclick()
      .then(() => {
        cy.get('[data-test="content-context-menu-delete"]')
          .click()
          .then(() => {
            cy.get('[data-test="delete-permanently"]').click()
            cy.get('button[aria-label="Delete"]').click()
            cy.get('h6').should('have.text', 'There is no query saved yet.')
            cy.get('[data-test="table-cell-test-search-for-a-keyword"]').should('not.exist')
          })
      })
  })
})
