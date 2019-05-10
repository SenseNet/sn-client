context('The login page', () => {
  beforeEach(() => {
    cy.visit('/#/login')
  })

  it('requires email', () => {
    cy.get('form')
      .contains('Login')
      .click()
    cy.contains('Please provide a valid e-mail address!').should('exist')
  })

  it('requires password', () => {
    cy.get('input[name=email]').type('businesscat@sensenet.com{enter}')
    cy.contains('Please provide a password!').should('exist')
  })

  it('requires valid email and password', () => {
    cy.get('input[name=email]').type('businesscat@sensenet.com')
    cy.get('input[name=password]').type(`invalid{enter}`)
    cy.contains('Wrong user name or password').should('exist')
  })

  it('should navigate to registration page', () => {
    cy.contains('Register').click()
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
