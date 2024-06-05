import { pathWithQueryParams } from '../../../src/services/query-string-builder'

const exampleSetup = `{
  "Apple": {
      "Seed1": false,
      "Seed2": false,
      "Seed3": "seed3",
      "Seed4": "seed4"
  }
}`

describe('Setup', () => {
  beforeEach(() => {
    cy.login()
    cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
      .get('[data-test="drawer-menu-item-settings"]')
      .click()
    cy.get('[data-test="drawer-submenu-item-configuration"]').click()
  })

  it('should open the context menu if a "settings item" is clicked with the right mouse button', () => {
    cy.get('[data-test="content-card-documentpreview.settings"]')
      .rightclick()
      .get('[data-test="content-context-menu-root"]')
      .should('be.visible')
      .get('[data-test="content-context-menu-browse"]')
      .should('be.visible')
      .get('[data-test="content-context-menu-copyto"]')
      .should('be.visible')
      .get('[data-test="content-context-menu-edit"]')
      .should('be.visible')
      .get('[data-test="content-context-menu-moveto"]')
      .should('be.visible')
      .get('[data-test="content-context-menu-checkout"]')
      .should('be.visible')
      .get('[data-test="content-context-menu-download"]')
      .should('be.visible')
      .get('[data-test="content-context-menu-root"]')
      .click()
  })

  it('should open a binary editor with the content of the "settings item" if Edit button is clicked', () => {
    cy.get('[data-test="content-card-documentpreview.settings"]')
      .within(() => {
        cy.get('[data-test="documentpreview-edit-button"]').click()
      })
      .get('[data-test="editor-title"]')
      .should('have.text', 'DocumentPreview.settings')
  })

  it('should open the document of the selected "settings item" if "Learn more" button is clicked', () => {
    cy.get('[data-test="content-card-documentpreview.settings"]').within(() => {
      cy.get('[data-test="documentpreview-learnmore-button"]')
        .parent('a')
        .should('have.attr', 'target', '_blank')
        .should('have.attr', 'href', 'https://docs.sensenet.com/guides/settings/setup#documentpreview.settings')
    })
  })

  it('should create a new setup file', (done) => {
    cy.get('[data-test="add-button"]').should('not.be.disabled').click()
    cy.get('[data-test="listitem-settings"]')
      .click()
      .then(() => {
        cy.get('[data-test="editor-title"] input').type('testSettings')

        cy.get('.monaco-editor textarea')
          .click({ force: true })
          .focused()
          .type('{ctrl}a')
          .clear()
          .invoke('val', exampleSetup)
          .trigger('input')

        cy.contains('Submit').click()

        cy.get('[data-test="settings-container"]').then((grid) => {
          cy.scrollToItem({
            container: grid,
            selector: '[data-test="content-card-testsettings.settings"]',
            done: (element) => {
              expect(!!(element.offsetWidth || element.offsetHeight || element.getClientRects().length)).to.equal(true)
              done()
            },
          })
        })
      })
  })

  it('check white- and blacklisted buttons', () => {
    // custom settings can be deleted and never hasn't documentation
    cy.get(`[data-test="testsettings-delete-button"]`).should('exist')
    cy.get(`[data-test="testsettings-edit-button"]`).should('exist')
    cy.get(`[data-test="testsettings-learnmore-button"]`).should('not.exist')

    // indexing is system and documented
    cy.get(`[data-test="indexing-delete-button"]`).should('not.exist')
    cy.get(`[data-test="indexing-edit-button"]`).should('exist')
    cy.get(`[data-test="indexing-learnmore-button"]`).should('exist')

    // logging is system and not documented
    cy.get(`[data-test="logging-delete-button"]`).should('not.exist')
    cy.get(`[data-test="logging-edit-button"]`).should('exist')
    cy.get(`[data-test="logging-learnmore-button"]`).should('not.exist')
  })

  it('should delete a setup file', () => {
    cy.get('[data-test="settings-container"]').then((grid) => {
      cy.scrollToItem({
        container: grid,
        selector: '[data-test="content-card-testsettings.settings"]',
      }).then(() => {
        cy.get(`[data-test="content-card-testsettings.settings"]`).rightclick({ force: true })

        cy.get('[data-test="content-context-menu-delete"]').click()
        cy.get('[data-test="delete-permanently"] input[type="checkbox"]').check()
        cy.get('[data-test="button-delete-confirm"]').click()

        cy.get('[data-test="content-card-testsettings.settings"]').should('not.exist')
      })
    })
  })
})
