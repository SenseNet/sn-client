import { ApiKey, clientTypes } from '../../../src/components/settings/api-key'
import { pathWithQueryParams } from '../../../src/services/query-string-builder'

describe('Api Keys', () => {
  beforeEach(() => {
    cy.login('superAdmin')
    cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
  })

  it('should display client APIKeys', () => {
    cy.get('[data-test="drawer-menu-item-settings"]').click()
    cy.intercept(/GetClients/).as('getClients')
    cy.get('[data-test="drawer-submenu-item-apikeys"]').click()

    cy.wait('@getClients').then(({ response }) => {
      const clientKeys: ApiKey[] = response?.body.clients.filter((client: any) => {
        return clientTypes.indexOf(client.type) > -1
      })
      cy.get('[data-test="client-keys"]').children().should('have.length', clientKeys.length)
    })
  })

  it('should copy client APIKeys to clipboard', () => {
    cy.get('[data-test="drawer-menu-item-settings"]').click()
    cy.intercept(/GetClients/).as('getClients')
    cy.get('[data-test="drawer-submenu-item-apikeys"]').click()

    cy.wait('@getClients').then(({ response }) => {
      const clientKeys: ApiKey[] = response?.body.clients.filter((client: any) => {
        return clientTypes.indexOf(client.type) > -1
      })

      cy.get('[data-test="client-keys"]')
        .children()
        .should('have.length', clientKeys.length)
        .each(($key, index) => {
          cy.wrap($key)
            .should('be.visible')
            .click()
            .then(() => {
              cy.window().then((win) => {
                win.navigator.clipboard.readText().then((content) => {
                  expect(content).to.equal(clientKeys[index].clientId)
                })
              })
            })
        })
    })
  })
})
