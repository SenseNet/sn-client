import 'cypress-file-upload'
import { codeLogin } from '@sensenet/authentication-oidc-react'

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

Cypress.Commands.add('login', (userType = 'admin') => {
  const user = Cypress.env('users')[userType]
  codeLogin({
    clientId: user.clientId,
    clientSecret: Cypress.env(`secret_${userType}`) || user.clientSecret,
    identityServerUrl: Cypress.env('identityServer'),
    appId: '11V28Add7IaP1iFw',
    userId: user.id,
    fetchMethod: (url, options) => cy.request({ url, ...options }),
  })
})

//All permissions should be enabled/disabled on Read tab
Cypress.Commands.add('checkReadPermissionGroup', (enabled = true) => {
  cy.get('[data-test="switcher-see"]')
    .should('be.visible')
    .parent()
    .find('.MuiSwitch-input')
    .should(enabled ? 'be.checked' : 'not.be.checked')
  cy.get('[data-test="switcher-preview"]')
    .parent()
    .find('.MuiSwitch-input')
    .should(enabled ? 'be.checked' : 'not.be.checked')
  cy.get('[data-test="switcher-previewwithoutwatermark"]')
    .parent()
    .find('.MuiSwitch-input')
    .should(enabled ? 'be.checked' : 'not.be.checked')
  cy.get('[data-test="switcher-previewwithoutredaction"]')
    .parent()
    .find('.MuiSwitch-input')
    .should(enabled ? 'be.checked' : 'not.be.checked')
  cy.get('[data-test="switcher-open"]')
    .parent()
    .find('.MuiSwitch-input')
    .should(enabled ? 'be.checked' : 'not.be.checked')
})

Cypress.Commands.add('checkAddItemList', (dropdownItems) => {
  cy.get('[data-test="add-button"]')
    .click()
    .then(() => {
      cy.get('[data-test="list-items"]')
        .children()
        .should('have.length', dropdownItems.length)
        .each(($span) => {
          const text = $span.text()
          if (text) {
            expect(dropdownItems).to.include(text)
          }
        })
    })
})
