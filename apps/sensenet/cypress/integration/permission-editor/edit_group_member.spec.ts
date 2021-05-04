import { pathWithQueryParams } from '../../../src/services/query-string-builder'

const expectedMembers = ['Developer Dog']
const expectedMembersAfterAdditon = ['Developer Dog', 'Business Cat']

describe('Editing group member in permission editor', () => {
  beforeEach(() => {
    cy.login()
    cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
  })

  it('adding a new member to a group works from permission editor', () => {
    cy.get('[data-test="drawer-menu-item-content"]').click()
    cy.get('[data-test="menu-item-it-workspace"]').rightclick()
    cy.get('[data-test="content-context-menu-setpermissions"]').click()
    cy.get('[data-test="permission-inherited-list"]').click()
    cy.get('[data-test="inherited-developers"]').click()
    cy.get('[data-test="members-tab"]').click()
    cy.get('[data-test="reference-list"] li')
      .should('have.length', expectedMembers.length)
      .each(($el) => {
        expect(expectedMembers).to.include($el.children().eq(0).children().eq(1).text())
      })
    cy.get('[data-test="reference-input"]').type('Business C')
    cy.get('[data-test="suggestion-business-cat"]').click()
    cy.get('[data-test="add-new-member"]').click()
    cy.get('[data-test="reference-list"] li')
      .should('have.length', expectedMembersAfterAdditon.length)
      .each(($el) => {
        expect(expectedMembersAfterAdditon).to.include($el.children().eq(0).children().eq(1).text())
      })
    cy.get('[data-test="permission-editor-submit"]').click()
    cy.get('[data-test="drawer-menu-item-users-and-groups"]').click()
    cy.get('[data-test="groups"]').click()
    cy.get(`[data-test="developers-members"]`).click()
    cy.get('[data-test="reference-list"] li')
      .should('have.length', expectedMembersAfterAdditon.length)
      .each(($el) => {
        expect(expectedMembersAfterAdditon).to.include($el.children().eq(0).children().eq(1).text())
      })
    cy.get(`[data-test="business-cat-delete"]`).click()
  })

  it('contains the appropriate values', () => {
    cy.get('[data-test="drawer-menu-item-content"]').click()
    cy.get('[data-test="menu-item-it-workspace"]').rightclick()
    cy.get('[data-test="content-context-menu-setpermissions"]').click()
    cy.get('[data-test="permission-inherited-list"]').click()
    cy.get('[data-test="inherited-developers"]').click()
    cy.get('[data-test="members-tab"]').click()
    cy.get('[data-test="reference-list"] li')
      .should('have.length', expectedMembers.length)
      .each(($el) => {
        expect(expectedMembers).to.include($el.children().eq(0).children().eq(1).text())
      })
  })
})
