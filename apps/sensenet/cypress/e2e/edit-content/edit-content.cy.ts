import { pathWithQueryParams } from '../../../src/services/query-string-builder'

describe('Edit Content', () => {
  before(() => {
    cy.login()
    cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
  })
  it('Test case 1: edit content should work properly.', () => {
    cy.get('[data-test="drawer-menu-item-content"]').click()
    cy.get('[data-test="menu-item-sample-workspace"]')
      .rightclick()
      .then(() => {
        cy.get('[data-test="content-context-menu-edit"]').click()
        cy.get('#DisplayName').type(' Test')
        cy.contains('Submit').click()
        cy.get(`[data-test="table-cell-sample-workspace-test"]`).should('have.text', 'Sample Workspace Test')
        //  breadcrumb test
        const expectedBreadcrumbItems = ['Content', '/', 'Sample Workspace Test']
        cy.get('[data-test="drawer-menu-item-content"]').click()
        cy.get('[data-test="menu-item-sample-workspace-test"]').click()
        cy.get('nav[aria-label="breadcrumb"] li').each(($el) => {
          expect(expectedBreadcrumbItems).to.include($el.text())
        })
      })
  })
  it('Test case 2: edit content should work properly.', () => {
    cy.get('[data-test="drawer-menu-item-content"]').click()
    cy.get('[data-test="menu-item-sample-workspace-test"]')
      .rightclick({ force: true })
      .then(() => {
        cy.get('[data-test="content-context-menu-edit"]').click()
        cy.get('#DisplayName').type('{selectall}Sample Workspace')
        cy.contains('Submit')
          .click()
          .then(() => {
            const expectedBreadcrumbItems = ['Content', '/', 'Sample Workspace']
            cy.get('[data-test="drawer-menu-item-content"]').click()
            cy.get('[data-test="menu-item-sample-workspace"]').click()
            cy.get('nav[aria-label="breadcrumb"] li').each(($el) => {
              expect(expectedBreadcrumbItems).to.include($el.text())
            })
          })
      })
  })
})
