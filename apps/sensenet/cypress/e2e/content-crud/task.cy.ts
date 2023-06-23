import { PATHS, resolvePathParams } from '../../../src/application-paths'
import { pathWithQueryParams } from '../../../src/services/query-string-builder'

describe('Task', () => {
  beforeEach(() => {
    cy.login()
    cy.visit(
      pathWithQueryParams({
        path: resolvePathParams({ path: PATHS.content.appPath, params: { browseType: 'explorer' } }),
        newParams: { repoUrl: Cypress.env('repoUrl'), path: '/SampleWorkspace/Tasks' },
      }),
    )
  })

  it('should create a content with the task type', () => {
    cy.get('[data-test="add-button"]').should('not.be.disabled').click()
    cy.get('[data-test="listitem-task"]')
      .click()
      .then(() => {
        cy.get('#Name').type('Test Task')
        cy.contains('Submit').click()

        cy.get(`[data-test="table-cell-test-task"]`).should('exist')
      })
  })

  it('should edit the task', () => {
    cy.get('[data-test="table-cell-test-task"]').rightclick({ force: true })
    cy.get('[data-test="content-context-menu-edit"]').click()
    cy.get('#Name').clear().type('Changed Test Task')
    cy.contains('Submit').click()

    cy.get('[data-test="table-cell-changed-test-task').should('exist')
    cy.get('[data-test="table-cell-test-task"]').should('not.exist')
  })

  it('should delete the task', () => {
    cy.get('[data-test="table-cell-changed-test-task').rightclick({ force: true })
    cy.get('[data-test="content-context-menu-delete"]').click()
    cy.get('[data-test="delete-permanently"] input[type="checkbox"]').check()

    cy.get('[data-test="button-delete-confirm"]').click()

    cy.get('[data-test="table-cell-changed-test-task').should('not.exist')
  })
})
