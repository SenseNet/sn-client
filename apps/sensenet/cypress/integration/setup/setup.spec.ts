import { pathWithQueryParams } from '../../../src/services/query-string-builder'

describe('Setup', () => {
  beforeEach(() => {
    cy.login()
    cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
      .get('[data-test="drawer-menu-item-settings"]')
      .click()
    cy.get('[data-test="drawer-menu-item-configuration"]').click()
  })

  it('should open the context menu if a "settings item" is clicked with the right mouse button', () => {
    cy.get('[data-test="content-card"]')
      .first()
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
    cy.get('[data-test="content-card"]')
      .first()
      .within(() => {
        cy.get('[data-test="documentpreview.settings-edit-button"]').click()
      })
      .get('[data-test="editor-title"]')
      .should('have.text', 'DocumentPreview.settings')
  })

  it('should open the document of the selected "settings item" if "Learn more" button is clicked', () => {
    cy.get('[data-test="content-card"]')
      .first()
      .within(() => {
        cy.get('[data-test="content-card-learnmore-button"]')
          .get('a[href="https://docs.sensenet.com/concepts/basics/07-settings#documentpreview-settings"]')
          .should('have.attr', 'target', '_blank')
      })
  })
})
