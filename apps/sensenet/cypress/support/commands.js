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

const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/
Cypress.on('uncaught:exception', (err) => {
  /* returning false here prevents Cypress from failing the test */
  if (resizeObserverLoopErrRe.test(err.message)) {
    return false
  }
})

Cypress.Commands.add('login', (userType = 'admin') => {
  const user = Cypress.env('users')[userType]
  codeLogin({
    clientId: user.clientId,
    clientSecret: Cypress.env(`secret_${userType}`) || user.clientSecret,
    identityServerUrl: Cypress.env('identityServer'),
    appId: 'OB4jkKf1Y5kR34OM',
    userId: user.id,
    fetchMethod: (url, options) => cy.request({ url, ...options }),
  })
})

// setGroup Permission to given permission
Cypress.Commands.add('setGroupPermission', (groupPermisisonName, permission) => {
  cy.get(`[data-test="permission-group-${groupPermisisonName}"] [data-test="permission-switcher"]`).as(
    'GroupPermissionSwitcher',
  )

  cy.get('@GroupPermissionSwitcher').should('be.visible')

  cy.get('@GroupPermissionSwitcher').find(`[data-test="${permission}"]`).click()

  cy.get(`[data-test="${groupPermisisonName}-group-permissions"] input[value=${permission}]`).should('be.checked')
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
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(2000)
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

Cypress.Commands.add('scrollToItem', ({ container, selector, done }) => {
  let scroll = 0

  return new Cypress.Promise((resolve) => {
    const timeout = () => {
      setTimeout(() => {
        scroll = scroll + 200
        container.scrollTop(scroll)

        const item = container.find(selector)
        if (!item.length) {
          timeout()
        } else {
          item[0].scrollIntoView()
          done?.(item[0])
          resolve(item[0])
        }
      }, 100)
    }

    timeout()
  })
})

Cypress.Commands.add('checkContextMenu', ({ selector, contextMenuItems, clickAction }) => {
  cy.get(selector)
    [clickAction]()
    .then(() => {
      cy.get('ul[role="menu"] li').each(($el) => {
        expect(contextMenuItems).to.include($el.text())
      })
      cy.get('body').click()
    })
})
