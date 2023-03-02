import { pathWithQueryParams } from '../../../src/services/query-string-builder'

const taskName = `Test Task List`

describe('Task-List', () => {
  before(() => {
    cy.login()
    cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
  })
  it('Task should be created', () => {
    cy.get('[data-test="drawer-menu-item-content"]').click()
    cy.get('[data-test="menu-item-it-workspace"]').click()
    cy.get('[data-test="add-button"]').click()
    cy.get('[data-test="listitem-task-list"]')
      .click()
      .then(() => {
        cy.get('#DisplayName').type(taskName)
        cy.get('#Name').type(taskName)
        cy.contains('Submit').click()
        cy.get(`[data-test="table-cell-${taskName.replace(/\s+/g, '-').toLowerCase()}"]`).should('have.text', taskName)
        cy.get('[data-test="snackbar-close"]').click()

        cy.get(`[data-test="table-cell-${taskName.replace(/\s+/g, '-').toLowerCase()}"]`).dblclick()

        cy.checkAddItemList(['Task'])
      })
    cy.get('[data-test="list-items"]').first().click()
  })

  it('Task should be edited', () => {
    const newTaskName = `${taskName}-edited`
    cy.get('[data-test="drawer-menu-item-content"]').click()
    cy.get('[data-test="menu-item-it-workspace"]').click()
    cy.get(`[data-test="table-cell-${taskName.replace(/\s+/g, '-').toLowerCase()}"]`).rightclick()
    cy.get('[data-test="content-context-menu-edit"]')
      .click()
      .then(() => {
        cy.get('#DisplayName').type('-edited')
        cy.contains('Submit').click()
        cy.get('[data-test="snackbar-close"]').click()
        cy.get(`[data-test="table-cell-${newTaskName.replace(/\s+/g, '-').toLowerCase()}"]`).should(
          'have.text',
          newTaskName,
        )
        cy.get(`[data-test="table-cell-${taskName.replace(/\s+/g, '-').toLowerCase()}"]`).should('not.exist')
      })
  })

  it('Task should be deleted', () => {
    const taskToBeDeleted = `${taskName}-edited`
    cy.get('[data-test="drawer-menu-item-content"]').click()
    cy.get('[data-test="menu-item-it-workspace"]').click()
    cy.get(`[data-test="table-cell-${taskToBeDeleted.replace(/\s+/g, '-').toLowerCase()}"]`).rightclick()
    cy.get('[data-test="content-context-menu-delete"]')
      .click()
      .then(() => {
        cy.get('[data-test="delete-permanently"]').click()
        cy.get('button[aria-label="Delete"]').click()
        cy.get(`[data-test="table-cell-${taskToBeDeleted.replace(/\s+/g, '-').toLowerCase()}"]`).should('not.exist')
      })
  })
})
