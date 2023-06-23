import { pathWithQueryParams } from '../../../src/services/query-string-builder'

const contextMenuItems = ['Details', 'Copy to', 'Edit', 'Move to', 'Versions', 'Share', 'Delete', 'Set permissions']

describe('Grid context menu', () => {
  before(() => {
    cy.login()
    cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
  })

  it('right-click on a content in the grid makes context-menu open', () => {
    cy.get('[data-test="drawer-menu-item-content"]').click()
    cy.checkContextMenu({
      selector: '[data-test="table-cell-sample-workspace"]',
      contextMenuItems,
      clickAction: 'rightclick',
    })
  })

  it('click on ... (Actions) in the grid makes context-menu open', () => {
    cy.get('[data-test="drawer-menu-item-content"]').click()
    cy.checkContextMenu({
      selector: '[data-test="actions-button-sampleworkspace"]',
      contextMenuItems,
      clickAction: 'click',
    })
  })
})
