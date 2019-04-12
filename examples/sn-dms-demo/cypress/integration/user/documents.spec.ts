context('The documents page', () => {
  beforeEach(() => {
    cy.login('businesscat@sensenet.com', 'businesscat')
  })

  it('header contains the logged in users avatar', () => {
    cy.visit('#/documents')

    cy.url().should('include', '/documents')

    cy.get('div[aria-label="Business Cat"]').should('exist')
  })
})
