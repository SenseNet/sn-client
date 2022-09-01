import { pathWithQueryParams } from '../../../src/services/query-string-builder'

const inheritedItems = ['Administrators', 'Developers', 'Editors']
const setOnThisItems = ['Members', 'Owners', 'Visitors']
describe('Permission editor main page lists', () => {
  before(() => {
    cy.login()
    cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
    cy.viewport(1340, 890)
  })

  it('appears from the context-menu', () => {
    cy.get('[data-test="drawer-menu-item-content"]').click()
    cy.get('[data-test="menu-item-it-workspace"]').rightclick()
    cy.get('[data-test="content-context-menu-setpermissions"]').click()
    cy.get('[data-test="permission-view-title-first"]').should('have.text', 'Set permissions for ')
    cy.get('[data-test="permission-view-title-second"]').should('have.text', 'IT Workspace')
  })

  it('Inherited from ancestor list has the expected child items', () => {
    inheritedItems.forEach((item) =>
      cy.get(`[data-test="inherited-${item.replace(/\s+/g, '-').toLowerCase()}"]`).should('not.exist'),
    )
    cy.get('[data-test="permission-inherited-list"]').should('be.visible').click()

    inheritedItems.forEach((item) =>
      cy.get(`[data-test="inherited-${item.replace(/\s+/g, '-').toLowerCase()}"]`).should('exist'),
    )
  })

  it('Set on this content list has the expected child items', () => {
    setOnThisItems.forEach((item) =>
      cy.get(`[data-test="set-on-this-${item.replace(/\s+/g, '-').toLowerCase()}"]`).should('exist'),
    )

    cy.get('[data-test="permission-set-on-this-list"]').should('be.visible').click()

    inheritedItems.forEach((item) =>
      cy.get(`[data-test="set-on-this-${item.replace(/\s+/g, '-').toLowerCase()}"]`).should('not.exist'),
    )
  })
})
