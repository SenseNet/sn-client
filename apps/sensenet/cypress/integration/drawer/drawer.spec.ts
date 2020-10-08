import { pathWithQueryParams } from '../../../src/services/query-string-builder'

describe('Drawer', () => {
  it('clicking on the hamburger menu icon should open the drawer', () => {
    cy.login()
    cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))

    cy.get('[data-test="drawer-expandcollapse-button"]').click()

    cy.get('[data-test="drawer"]').should('have.css', 'width', '250px')
  })

  it('clicking on the X icon should close the extended view of the drawer', () => {
    cy.login()
    cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
    cy.get('[data-test="drawer-expandcollapse-button"]').click()

    cy.get('[data-test="drawer-expandcollapse-button"]').click()

    cy.get('[data-test="drawer"]').should('have.css', 'width', '90px')
  })
})
