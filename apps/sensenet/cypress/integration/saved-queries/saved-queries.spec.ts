import { pathWithQueryParams } from '../../../src/services/query-string-builder'

const expedtedSearchItems = ['Sample workspace', 'Sample link', 'Sample memo', 'Sample task', 'Sample event']

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

    expedtedSearchItems.forEach((item) => {
      cy.get(`[data-test="table-cell-${item?.replace(/\s+/g, '-').toLowerCase()}"]`).should('be.visible')
    })

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

        expedtedSearchItems.forEach((item) => {
          cy.get(`[data-test="table-cell-${item?.replace(/\s+/g, '-').toLowerCase()}"]`).should('be.visible')
        })
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
