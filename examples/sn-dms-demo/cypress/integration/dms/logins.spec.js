/// <reference types="Cypress" />

context('The login page', () => {
  beforeEach(() => {
    cy.visit('/#/login')
  })

  it('can authenticate properly', () => {
    cy.get('input[name=email]').type('businesscat@sensenet.com')
    cy.get('input[name=password]').type(`businesscat{enter}`)

    cy.url().should('include', '/documents')

    cy.get('div[aria-label="Business Cat"]').should('exist')

    cy.window()
      .its('localStorage')
      .invoke('getItem', 'sn-https://dmsservice.demo.sensenet.com-access')
      .should('not.be.empty')
  })

  it('shows error messages when required fields are not filled', () => {
    cy.get('form > .MuiButtonBase-root-83').click()
    cy.contains('Please provide a valid e-mail address!').should('exist')
    cy.contains('Please provide a password!').should('exist')
  })

  it('should navigate to registration page', () => {
    cy.contains('Register').click()
    cy.url().should('include', '/registration')
    cy.get('input').should('have.length', 3)
  })
})
