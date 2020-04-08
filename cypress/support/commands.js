Cypress.Commands.add('login', (userName, password, repository) => {
  cy.viewport(1602, 947)

  cy.visit('/')

  cy.url().should('include', '/login')

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

  cy.get('.MuiIconButton-colorInherit').click()

  cy.location('pathname', { timeout: 20000 }).should('eq', '/')

  cy.get('.MuiIconButton-colorInherit').click()
})

Cypress.Commands.add('logout', () => {
  cy.xpath('/html/body/div[1]/div/header/div/div[3]/button/span[1]').click()

  cy.xpath('/html/body/div[1]/div/header/div/div[3]/div[2]/div/ul/li[2]').as('logoutButton')

  cy.get('@logoutButton')
    .contains('Log out')
    .click()

  cy.xpath('/html/body/div[2]/div[3]/div/div/div[3]/button[2]').click()

  cy.url().should('include', '/login')
})
