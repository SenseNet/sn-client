import { pathWithQueryParams } from '../../../src/services/query-string-builder'

describe('Edit Content', () => {
  before(() => {
    cy.login()
    cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
  })
  it('Test case 1: edit content should works properly.', () => {
    cy.get('[data-test="Content"]').click()
    cy.get('[data-test="menu-item-IT Workspace"]')
      .rightclick()
      .then(() => {
        cy.get('[data-test="content-context-menu-edit"]').click()
        cy.get('#DisplayName').type(' Test')
        cy.contains('Submit').click()
        cy.get(`[data-test="table-cell-IT Workspace Test"]`).should('have.text', 'IT Workspace Test')
        //  breadcrumb test
        const expectedBreadcrumbItems = ['Content', '/', 'IT Workspace Test']
        cy.get('[data-test="Content"]').click()
        cy.get('[data-test="menu-item-IT Workspace Test"]').click()
        cy.get('nav[aria-label="breadcrumb"] li').each(($el) => {
          console.log($el.text())
          expect(expectedBreadcrumbItems).to.include($el.text())
        })
      })
  })
  it('Test case 2: edit content should works properly.', () => {
    cy.get('[data-test="Content"]').click()
    cy.get('[data-test="menu-item-IT Workspace Test"]')
      .rightclick()
      .then(() => {
        cy.get('[data-test="content-context-menu-edit"]').click()
        cy.get('#DisplayName').type('{selectall}IT Workspace')
        cy.contains('Submit')
          .click()
          .then(() => {
            const expectedBreadcrumbItems = ['Content', '/', 'IT Workspace']
            cy.get('[data-test="Content"]').click()
            cy.get('[data-test="menu-item-IT Workspace"]').click()
            cy.get('nav[aria-label="breadcrumb"] li').each(($el) => {
              expect(expectedBreadcrumbItems).to.include($el.text())
            })
          })
      })
  })
})
