Cypress.Commands.add('login', (email, password) => {
  cy.visit('')
  cy.window().then(async win => {
    await win.repository.authentication.login(email, password)
  })
})
