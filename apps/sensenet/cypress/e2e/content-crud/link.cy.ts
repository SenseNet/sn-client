import { PATHS, resolvePathParams } from '../../../src/application-paths'
import { pathWithQueryParams } from '../../../src/services/query-string-builder'

describe('Link', () => {
  beforeEach(() => {
    cy.login()
    cy.visit(
      pathWithQueryParams({
        path: resolvePathParams({ path: PATHS.content.appPath, params: { browseType: 'explorer' } }),
        newParams: { repoUrl: Cypress.env('repoUrl'), path: '/SampleWorkspace/Links' },
      }),
    )
  })

  it('should create a content with the link type', () => {
    cy.get('[data-test="add-button"]').should('not.be.disabled').click()
    cy.get('[data-test="listitem-link"]')
      .click()
      .then(() => {
        cy.get('#DisplayName').type('Test Link')
        cy.get('#Url').type('www.test.com')
        cy.contains('Submit').click()

        cy.get(`[data-test="table-cell-test-link"]`).should('exist')
      })
  })

  it('should edit the link', () => {
    cy.get('[data-test="table-cell-test-link"]').rightclick({ force: true })
    cy.get('[data-test="content-context-menu-edit"]').click()
    cy.get('#DisplayName').clear().type('Changed Test Link')
    cy.contains('Submit').click()

    cy.get('[data-test="table-cell-changed-test-link').should('exist')
    cy.get('[data-test="table-cell-test-link"]').should('not.exist')
  })

  it('should delete the link', () => {
    cy.get('[data-test="table-cell-changed-test-link').rightclick({ force: true })
    cy.get('[data-test="content-context-menu-delete"]').click()
    cy.get('[data-test="delete-permanently"] input[type="checkbox"]').check()

    cy.get('[data-test="button-delete-confirm"]').click()

    cy.get('[data-test="table-cell-changed-test-link').should('not.exist')
  })
})
