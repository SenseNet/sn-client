Cypress.Commands.add('login', (email, password) => {
  cy.visit('')
  cy.window().then(async win => {
    const result = await win.repository.authentication.login(email, password)
    console.log(result)
  })
})
