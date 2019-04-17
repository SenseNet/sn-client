Cypress.Commands.add('login', (email, password) => {
  cy.visit('')
  cy.window().then(async win => {
    await win.repository.authentication.login(email, password)
  })
})

Cypress.Commands.add('registerUser', (email, password) => {
  cy.visit('')
  cy.window().then(async win => {
    await win.repository.executeAction({
      name: 'RegisterUser',
      idOrPath: `/Root/IMS('Public')`,
      body: {
        email,
        password,
      },
      method: 'POST',
    })
  })
})
