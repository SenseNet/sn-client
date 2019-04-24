import { User } from '@sensenet/default-content-types'

Cypress.Commands.add('login', (email, password) => {
  cy.visit('')
  Cypress.log({
    name: 'login',
    consoleProps: () => {
      return { email, password }
    },
    message: [`${email} | ${password}`],
  })
  cy.window().then(async win => {
    return await win.repository.authentication.login(email, password)
  })
})

Cypress.Commands.add('registerUser', (email, password) => {
  cy.visit('')
  cy.window().then(async win => {
    return await win.repository.executeAction<{ email: string; password: string }, User>({
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
