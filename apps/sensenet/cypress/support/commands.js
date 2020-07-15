// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

/* eslint-disable @typescript-eslint/camelcase */

Cypress.Commands.add('login', (userType = 'admin') => {
  const user = Cypress.env('users')[userType]

  const configuration = {
    client_id: user.clientId,
    client_secret: user.clientSecret,
    grant_type: 'client_credentials',
    scope: encodeURIComponent('sensenet'),
  }

  const requestBody = Object.keys(configuration).reduce((acc, current, idx) => {
    return `${acc}${current}=${configuration[current]}${idx === Object.keys(configuration).length - 1 ? '' : '&'}`
  }, '')

  cy.request({
    url: `${Cypress.env('identityServer')}/connect/token`,
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: requestBody,
  }).then((resp) => {
    const oidcUser = resp.body

    oidcUser.profile = {
      sub: user.id,
    }

    window.sessionStorage.setItem(`oidc.user:${Cypress.env('identityServer')}:spa`, JSON.stringify(oidcUser))
  })
})
