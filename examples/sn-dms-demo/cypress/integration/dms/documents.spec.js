/// <reference types="Cypress" />

context('The documents page', () => {
  beforeEach(() => {
    cy.visit('/')
  })
  it('sets auth cookie when logging in via form submission', () => {
    cy.window()
      .its('repository')
      .then(repo => repo.authentication.login('businesscat@sensenet.com', 'businesscat'))
      .then(() => {
        cy.visit('#/documents')

        cy.url().should('include', '/documents')

        cy.get('div[aria-label="Business Cat"]').should('exist')
      })
  })
})
