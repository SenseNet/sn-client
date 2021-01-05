import { pathWithQueryParams } from '../../../src/services/query-string-builder'

describe('Users enabled field', () => {
  before(() => {
    cy.login()
    cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
  })
  it('Disabled state should work properly', () => {
    cy.get('[data-test="drawer-menu-item-users-and-groups"]').click()
    cy.get('[data-test="switcher-developer-dog"]').click()
    cy.get('[data-test="table-cell-developer-dog"]').dblclick()
    cy.get('.MuiSwitch-root').find('.MuiSwitch-track').should('have.css', 'background-color', 'rgb(238, 238, 238)')
    cy.get('[data-test="cancel"]').click()
  })
  it('Enabled state should work properly', () => {
    cy.get('[data-test="drawer-menu-item-users-and-groups"]').click()
    cy.get('[data-test="switcher-developer-dog"]').click()
    cy.get('[data-test="table-cell-developer-dog"]').dblclick()
    cy.get('.MuiSwitch-root').find('.MuiSwitch-track').should('have.css', 'background-color', 'rgb(255, 255, 255)')
    cy.get('[data-test="cancel"]').click()
  })
})
