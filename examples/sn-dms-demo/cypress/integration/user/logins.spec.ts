import { resources } from '../../../src/assets/resources'

context('The login page', () => {
  beforeEach(() => {
    cy.visit('/#/login')
  })

  it('requires email', () => {
    cy.get('form')
      .contains(resources.LOGIN_BUTTON_TEXT)
      .click()
    cy.contains(resources.EMAIL_IS_NOT_VALID_MESSAGE).should('exist')
  })

  it('requires password', () => {
    cy.get('input[name=email]').type('businesscat@sensenet.com{enter}')
    cy.contains(resources.PASSWORD_IS_NOT_VALID_MESSAGE).should('exist')
  })

  it('requires valid email and password', () => {
    cy.get('input[name=email]').type('businesscat@sensenet.com')
    cy.get('input[name=password]').type(`invalid{enter}`)
    cy.contains(resources.WRONG_USERNAME_OR_PASSWORD).should('exist')
  })

  it('should navigate to registration page', () => {
    cy.contains(resources.REGISTER_TAB_TEXT).click()
    cy.url().should('include', '/registration')
    cy.get('input').should('have.length', 3)
  })

  it('can authenticate properly', () => {
    cy.get('input[name=email]').type('businesscat@sensenet.com')
    cy.get('input[name=password]').type(`businesscat{enter}`)

    cy.url({ timeout: 10000 }).should('include', '/documents')

    cy.get('div[aria-label="Business Cat"]').should('exist')

    cy.window()
      .its('localStorage')
      .invoke('getItem', 'sn-https://dmsservice.demo.sensenet.com-access')
      .should('not.be.empty')
  })
})
