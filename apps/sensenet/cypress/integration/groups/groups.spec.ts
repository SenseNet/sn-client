import { pathWithQueryParams } from '../../../src/services/query-string-builder'

const contextMenuItems = ['browse', 'copyto', 'edit', 'moveto', 'delete']
describe('Groups', () => {
  before(() => {
    cy.login()
    cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
  })
  it('Groups list should have the appropriate data', () => {
    const items = ['Administrators', 'Developers', 'Editors']
    cy.get('[data-test="drawer-menu-item-Users and groups"]').click()
    cy.get('[data-test="groups"]').click()
    items.forEach((item) => {
      cy.get(`[data-test="table-cell-${item}"]`).should('be.visible')
    })
  })
  it('right click on a group should open context-menu', () => {
    cy.get('[data-test="drawer-menu-item-Users and groups"]').click()
    cy.get('[data-test="groups"]').click()
    cy.get('[data-test="table-cell-Editors"]')
      .rightclick()
      .then(() => {
        contextMenuItems.forEach((item) => {
          cy.get(`[data-test="content-context-menu-${item}"]`).should('be.visible')
        })
        cy.get('body').click()
      })
  })
  it('Double click on group should open a edit form of the content', () => {
    cy.get('[data-test="drawer-menu-item-Users and groups"]').click()
    cy.get('[data-test="groups"]').click()
    cy.get('[data-test="table-cell-Editors"]').dblclick()
    cy.get('[data-test="viewtitle"').should('have.text', 'Edit Editors')
    cy.get('button[aria-label="Cancel"]').click()
  })
})
