import { ApiKey, clientTypes, spaTypes } from '../../../src/components/settings/api-key'
import { pathWithQueryParams } from '../../../src/services/query-string-builder'

function testApiKeySecrets(apiKey: ApiKey, index: number, isSPA = false) {
  const keysContainer = isSPA ? '[data-test="spa-keys"]' : '[data-test="client-keys"]'

  if (apiKey.secrets.length === 0) {
    cy.get(keysContainer).children().eq(index).click().find('[data-test="secret-container"]').should('not.exist')
    return
  }

  cy.get(keysContainer)
    .children()
    .eq(index)
    .find('[data-test="type-container"]')
    .click()
    .closest('[data-test="api-key-accordion-container"]')
    .find('[data-test="user-secret-container"]')
    .each(($key, secretIndex) => {
      cy.wrap($key)
        .should('exist')
        .click()
        .then(() => {
          cy.window().then((win) => {
            win.navigator.clipboard.readText().then((content) => {
              expect(content).to.equal(apiKey.secrets[secretIndex].value)
            })
          })
        })
    })
}
let clientKeys: ApiKey[] = []

let spaKeys: ApiKey[] = []

describe('Api Keys', () => {
  beforeEach(() => {
    cy.login('superAdmin')
    cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
  })

  it('should display client APIKeys', () => {
    cy.get('[data-test="drawer-menu-item-settings"]').click()
    cy.intercept(/GetClients/).as('getClients')
    cy.intercept(/GetClientsForRepository\?/).as('GetClientsForRepository')
    cy.get('[data-test="drawer-submenu-item-apikeys"]').click()

    cy.wait('@getClients').then(({ response }) => {
      clientKeys = response?.body.clients.filter((client: any) => {
        return clientTypes.indexOf(client.type) > -1
      })

      cy.get('[data-test="client-keys"]').children().should('have.length', clientKeys.length)

      for (let i = 0; i < clientKeys.length; i++) {
        const apiKey = clientKeys[i]

        testApiKeySecrets(apiKey, i)
      }
    })

    if (clientKeys.length === 0) {
      cy.reload()

      cy.wait('@GetClientsForRepository').then(({ response: responseForRepo }) => {
        clientKeys = responseForRepo?.body.clients.filter((client: any) => {
          return clientTypes.indexOf(client.type) > -1
        })
        cy.get('[data-test="client-keys"]').children().should('have.length', clientKeys.length)

        for (let i = 0; i < clientKeys.length; i++) {
          const apiKey = clientKeys[i]

          testApiKeySecrets(apiKey, i)
        }
      })
    }
  })

  it('should copy client APIKeys to clipboard', () => {
    cy.get('[data-test="drawer-menu-item-settings"]').click()
    cy.intercept(/GetClients\?/).as('getClients')
    cy.intercept(/GetClientsForRepository\?/).as('GetClientsForRepository')
    cy.get('[data-test="drawer-submenu-item-apikeys"]').click()

    cy.wait('@getClients').then(({ response }) => {
      clientKeys = response?.body.clients.filter((client: any) => {
        return clientTypes.indexOf(client.type) > -1
      })

      cy.get('[data-test="client-keys"]')
        .children()
        .should('have.length', clientKeys.length)
        .each(($key, index) => {
          cy.wrap($key)
            .should('exist')
            .click()
            .then(() => {
              cy.window().then((win) => {
                win.navigator.clipboard.readText().then((content) => {
                  expect(content).to.equal(clientKeys[index].clientId)
                })
              })
            })
        })

      if (clientKeys.length === 0) {
        cy.reload()
        cy.wait('@GetClientsForRepository').then(({ response: reponseForRepo }) => {
          clientKeys = reponseForRepo?.body.clients.filter((client: any) => {
            return clientTypes.indexOf(client.type) > -1
          })

          cy.get('[data-test="client-keys"]')
            .children()
            .should('have.length', clientKeys.length)
            .each(($key, index) => {
              cy.wrap($key)
                .should('exist')
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
      }
    })
  })

  it('should display spa APIKeys', () => {
    cy.get('[data-test="drawer-menu-item-settings"]').click()
    cy.intercept(/GetClients/).as('getClients')
    cy.intercept(/GetClientsForRepository\?/).as('GetClientsForRepository')
    cy.get('[data-test="drawer-submenu-item-apikeys"]').click()

    cy.wait('@getClients').then(({ response }) => {
      cy.get('[data-test="spas-tab"]').click()
      spaKeys = response?.body.clients.filter((client: any) => {
        return spaTypes.indexOf(client.type) > -1
      })

      cy.get('[data-test="spa-keys"]').children().should('have.length', spaKeys.length)

      for (let i = 0; i < spaKeys.length; i++) {
        const apiKey = spaKeys[i]
        testApiKeySecrets(apiKey, i, true)
      }

      if (spaKeys.length === 0) {
        cy.reload()
        cy.get('[data-test="spas-tab"]').click()
        cy.wait('@GetClientsForRepository').then(({ response: responseForRepo }) => {
          spaKeys = responseForRepo?.body.clients.filter((client: any) => {
            return spaTypes.indexOf(client.type) > -1
          })

          cy.get('[data-test="spa-keys"]').children().should('have.length', spaKeys.length)

          for (let i = 0; i < spaKeys.length; i++) {
            const apiKey = spaKeys[i]

            testApiKeySecrets(apiKey, i, true)
          }
        })
      }
    })
  })

  it('should copy spa APIKeys to clipboard', () => {
    cy.get('[data-test="drawer-menu-item-settings"]').click()
    cy.intercept(/GetClients\?/).as('getClients')
    cy.intercept(/GetClientsForRepository\?/).as('GetClientsForRepository')
    cy.get('[data-test="drawer-submenu-item-apikeys"]').click()

    cy.wait('@getClients').then(({ response }) => {
      cy.get('[data-test="spas-tab"]').click()

      spaKeys = response?.body.clients.filter((client: any) => {
        return spaTypes.indexOf(client.type) > -1
      })

      cy.get('[data-test="spa-keys"]')
        .children()
        .should('have.length', spaKeys.length)
        .each(($key, index) => {
          cy.wrap($key)
            .should('exist')
            .click()
            .then(() => {
              cy.window().then((win) => {
                win.navigator.clipboard.readText().then((content) => {
                  expect(content).to.equal(spaKeys[index].clientId)
                })
              })
            })
        })
    })

    if (spaKeys.length === 0) {
      cy.reload()
      cy.get('[data-test="spas-tab"]').click()
      cy.wait('@GetClientsForRepository').then(({ response }) => {
        spaKeys = response?.body.clients.filter((client: any) => {
          return spaTypes.indexOf(client.type) > -1
        })

        cy.get('[data-test="spa-keys"]')
          .children()
          .should('have.length', spaKeys.length)
          .each(($key, index) => {
            cy.wrap($key)
              .should('exist')
              .click()
              .then(() => {
                cy.window().then((win) => {
                  win.navigator.clipboard.readText().then((content) => {
                    expect(content).to.equal(spaKeys[index].clientId)
                  })
                })
              })
          })
      })
    }
  })
})
