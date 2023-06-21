import { PATHS, resolvePathParams } from '../../../src/application-paths'
import { pathWithQueryParams } from '../../../src/services/query-string-builder'

describe('Calendar event', () => {
  beforeEach(() => {
    cy.login()
    cy.visit(
      pathWithQueryParams({
        path: resolvePathParams({ path: PATHS.content.appPath, params: { browseType: 'explorer' } }),
        newParams: { repoUrl: Cypress.env('repoUrl'), path: '/SampleWorkspace/Calendar' },
      }),
    )
  })

  it('should create a content with the calendar event type', () => {
    cy.get('[data-test="add-button"]').should('not.be.disabled').click()
    cy.get('[data-test="listitem-calendar-event"]')
      .click()
      .then(() => {
        cy.get('#DisplayName').type('Test Calendar Event')
        cy.get('#Location').type('Somewhere')
        cy.contains('Submit').click()

        cy.get(`[data-test="table-cell-test-calendar-event"]`).should('exist')
      })
  })

  it('should edit the calendar event', () => {
    cy.get('[data-test="table-cell-test-calendar-event"]').rightclick({ force: true })
    cy.get('[data-test="content-context-menu-edit"]').click()
    cy.get('#DisplayName').clear().type('Changed Test Calendar Event')
    cy.contains('Submit').click()

    cy.get('[data-test="table-cell-changed-test-calendar-event').should('exist')
    cy.get('[data-test="table-cell-test-calendar-event"]').should('not.exist')
  })

  it('should delete the calendar event', () => {
    cy.get('[data-test="table-cell-changed-test-calendar-event').rightclick({ force: true })
    cy.get('[data-test="content-context-menu-delete"]').click()
    cy.get('[data-test="delete-permanently"] input[type="checkbox"]').check()

    cy.get('[data-test="button-delete-confirm"]').click()

    cy.get('[data-test="table-cell-changed-test-calendar-event').should('not.exist')
  })
})
