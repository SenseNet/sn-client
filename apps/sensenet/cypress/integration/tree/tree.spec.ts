import { pathWithQueryParams } from '../../../src/services/query-string-builder'

const items = ['Calendar', 'Document library', 'Groups', 'Links', 'Memos', 'Tasks', 'Image Library']

describe('Tree', () => {
  before(() => {
    cy.login()
    cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
  })
  it('Tree item should open with the list of its children.', () => {
    cy.get('[data-test="drawer-menu-item-content"]').click()
    cy.get('[data-test="menu-item-it-workspace"]')
      .click()
      .then(() => {
        items.forEach(($el) => {
          cy.get(`[data-test="menu-item-${$el.replace(/\s+/g, '-').toLowerCase()}"]`).should('be.visible')
        })
      })
  })
  it('Click on the Tree item when it is open should close it and make its children invisible.', () => {
    cy.get('[data-test="drawer-menu-item-content"]').click()
    cy.get('[data-test="menu-item-it-workspace"]')
      .click()
      .then(() => {
        cy.get('[data-test="menu-item-it-workspace"]')
          .click()
          .then(() => {
            items.forEach(($el) => {
              cy.get(`[data-test="menu-item-${$el.replace(/\s+/g, '-').toLowerCase()}"]`).should('not.exist')
            })
            cy.get('body').click()
          })
      })
  })
  it('Right click on the Tree item should make context-menu open.', () => {
    const contextMenuItems = ['Details', 'Copy to', 'Edit', 'Move to', 'Versions', 'Share', 'Delete', 'Set permissions']
    cy.get('[data-test="drawer-menu-item-content"]').click()
    cy.checkContextMenu({
      selector: '[data-test="menu-item-it-workspace"]',
      contextMenuItems,
      clickAction: 'rightclick',
    })
  })
})
