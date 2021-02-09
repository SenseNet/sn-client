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
    cy.get('[data-test="viewtitle"]').should('be.visible')
    cy.get('.MuiSwitch-root').find('.MuiSwitch-input').first().should('not.be.checked')
    cy.get('[data-test="cancel"]').click()
  })
  it('Enabled state should work properly', () => {
    cy.get('[data-test="drawer-menu-item-users-and-groups"]').click()
    cy.get('[data-test="switcher-developer-dog"]').click()
    cy.get('[data-test="table-cell-developer-dog"]').dblclick()
    cy.get('[data-test="viewtitle"]').should('be.visible')
    cy.get('.MuiSwitch-root').find('.MuiSwitch-input').first().should('be.checked')
    cy.get('[data-test="cancel"]').click()
  })
})
