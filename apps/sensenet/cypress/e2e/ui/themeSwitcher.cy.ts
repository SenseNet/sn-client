import { pathWithQueryParams } from '../../../src/services/query-string-builder'

describe('Switching themes', () => {
  beforeEach(() => {
    cy.login()
    cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
  })

  it('should be set to light by default', () => {
    cy.get('[data-test="user-menu-button"]').click()
    cy.get('[data-test="theme-status"]').should('have.text', 'Dark theme')
    cy.get('[data-test="theme-switcher"]')
      .should('be.visible')
      .parent()
      .find('.MuiSwitch-input')
      .should('not.be.checked')
  })

  it('should switch theme to dark on click', () => {
    cy.get('[data-test="user-menu-button"]').click()
    cy.get('[data-test="theme-switcher"]').click()

    cy.get('[data-test="theme-status"]').should('have.text', 'Light theme')
    cy.get('[data-test="theme-switcher"]').should('be.visible').parent().find('.MuiSwitch-input').should('be.checked')
  })
})
