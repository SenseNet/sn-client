describe('Open admin ui', () => {
  beforeEach(() => {
    cy.viewport(1602, 947)
    cy.visit('/')
  })

  it('reaches the admin landing page', () => {
    cy.contains('Welcome!')
    cy.url().should('include', '/login')
  })

  it('accepts input for username', () => {
    const userName = 'businesscat'
    const password = 'businesscat'
    const repository = 'https://dev.demo.sensenet.com'
    const welcomeMessage = 'Welcome back, Business Cat'

    cy.get('#username')
      .type(userName)
      .should('have.value', userName)

    cy.get('#password')
      .type(password)
      .should('have.value', password)

    cy.get('#repository')
      .type(repository)
      .should('have.value', repository)

    cy.get('button[aria-label="Login"]').click()

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(3000)

    cy.contains(welcomeMessage)
  })
})
