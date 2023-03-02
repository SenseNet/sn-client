import { pathWithQueryParams } from '../../../src/services/query-string-builder'

const makeContentText = 'Make content public'
const assignNewText = 'Assign new permission'
const makeContentTooltip =
  'Clicking this button makes the content and the below sub-tree public for non-authenticated (Visitor) users'

describe('Permission editor main page links', () => {
  beforeEach(() => {
    cy.login()
    cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
    cy.get('[data-test="drawer-menu-item-content"]').click()
    cy.get('[data-test="menu-item-it-workspace"]').rightclick()
    cy.get('[data-test="content-context-menu-setpermissions"]').click()
  })

  it('should display the appropriate buttons', () => {
    cy.viewport(1840, 890)
    cy.get('[data-test="make-content-public-or-private"]').should('be.visible').should('have.text', makeContentText)
    cy.get('[data-test="assign-new-permission"]').should('be.visible').should('have.text', assignNewText)
    cy.get('[data-test="make-content-public-or-private"]').trigger('mouseover')
    cy.get('[role="tooltip"]').should('have.text', makeContentTooltip)
  })

  it('should navigate to the permission editor screen of its parent', () => {
    cy.get('[data-test="permission-inherited-list"]').click()
    cy.get('[data-test="inherited-developers-link"]').click()
    cy.get('[data-test="permission-view-title-first"]').should('have.text', 'Set permissions for ')
    cy.get('[data-test="permission-view-title-second"]').should('have.text', 'Content')
  })
})
