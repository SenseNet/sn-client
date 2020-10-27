import { pathWithQueryParams } from '../../../src/services/query-string-builder'

const taskName = `Test Task List`

describe('Task-List', () => {
  before(() => {
    cy.login()
    cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
  })
  it('Task should be created', () => {
    cy.get('[data-test="drawer-menu-item-Content"]').click()
    cy.get('[data-test="menu-item-IT Workspace"]').click()
    cy.get('[data-test="add-button"').click()
    cy.get('[data-test="listitem-Task list"')
      .click()
      .then(() => {
        cy.get('#DisplayName').type(taskName)
        cy.get('#Name').type(taskName)
        cy.contains('Submit').click()
        cy.get(`[data-test="table-cell-${taskName}"]`).should('have.text', taskName)

        cy.get(`[data-test=menu-item-${taskName}]`).click()
        cy.get('[data-test="add-button"')
          .click()
          .then(() => {
            const expectedMenuItems = ['Task']
            cy.get('[role="presentation"] li')
              .should('have.length', expectedMenuItems.length)
              .each(($el) => {
                expect(expectedMenuItems).to.include($el.text())
              })
          })
      })
  })

  it('Task should be edited', () => {
    const newTaskName = `${taskName}-edited`
    cy.get('[data-test="drawer-menu-item-Content"]').click()
    cy.get('[data-test="menu-item-IT Workspace"]').click()
    cy.get(`[data-test="table-cell-${taskName}"]`).rightclick()
    cy.get('[data-test="contextmenu-edit"]')
      .click()
      .then(() => {
        cy.get('#DisplayName').type('-edited')
        cy.contains('Submit').click()
        cy.get(`[data-test="table-cell-${newTaskName}"]`).should('have.text', newTaskName)
        cy.get(`[data-test="table-cell-${taskName}"]`).should('not.have.text', taskName)
      })
  })
  it('Task should be deleted', () => {
    const taskToBeDeleted = `${taskName}-edited`
    cy.get('[data-test="drawer-menu-item-Content"]').click()
    cy.get('[data-test="menu-item-IT Workspace"]').click()
    cy.get(`[data-test="table-cell-${taskToBeDeleted}"]`).rightclick()
    cy.get('[data-test="contextmenu-delete"]')
      .click()
      .then(() => {
        cy.get('[data-test="delete-permanently"]').click()
        cy.get('button[aria-label="Delete"]').click()
        cy.get(`[data-test="table-cell-${taskToBeDeleted}"]`).should('not.exist')
      })
  })
})
