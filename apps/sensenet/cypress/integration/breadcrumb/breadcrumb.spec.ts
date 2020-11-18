import { pathWithQueryParams } from '../../../src/services/query-string-builder'

const expectedBreadcrumbItems = ['Content', '/', 'IT Workspace', '/', 'Document library']

describe('Breadcrumb', () => {
  before(() => {
    cy.login()
    cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
  })
  it('breadcrumb after navigating to IT Workspace, breadcrumb should be displayed as it should.', () => {
    cy.get('[data-test="drawer-menu-item-content"]').click()
    cy.get('[data-test="menu-item-it-workspace"]')
      .click()
      .then(() => {
        cy.get('[data-test="table-cell-calendar"]').should('be.visible')
      })

    cy.get('[data-test="menu-item-document-library"]').click({ force: true })
    cy.get('nav[aria-label="breadcrumb"] li')
      .should('have.length', expectedBreadcrumbItems.length)
      .each(($el) => {
        expect(expectedBreadcrumbItems).to.include($el.text())
      })
  })
  it('clicking on parent item in the breadcrumb should open the chosen container', () => {
    cy.get('[data-test="drawer-menu-item-content"]').click()
    cy.get('[data-test="menu-item-it-workspace"]')
      .click()
      .then(() => {
        cy.get('[data-test="table-cell-calendar"]').should('be.visible')
      })
    cy.get('[data-test="menu-item-document-library"]')
      .click({ force: true })
      .then(() => {
        cy.get('[data-test="table-cell-calendar"]').should('not.be.visible')
      })
    cy.get('nav[aria-label="breadcrumb"] li')
      .find('button[aria-label="IT Workspace"]')
      .click()
      .then(() => {
        cy.get('[data-test="table-cell-calendar"]').should('be.visible')
      })
  })
  it('right click on a breadcrumb item should open its actionmenu.', () => {
    cy.get('[data-test="drawer-menu-item-content"]').click()
    cy.get('[data-test="menu-item-it-workspace"]')
      .click()
      .then(() => {
        cy.get('[data-test="table-cell-calendar"]').should('be.visible')
      })
    cy.get('[data-test="menu-item-document-library"]').click({ force: true })
    cy.get('nav[aria-label="breadcrumb"] li')
      .should('have.length', expectedBreadcrumbItems.length)
      .find('button[aria-label="IT Workspace"]')
      .rightclick()
      .then(() => {
        cy.get('ul[role="menu"]').should('be.visible')
      })
  })
})
