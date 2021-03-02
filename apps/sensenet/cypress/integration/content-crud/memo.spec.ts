import { PATHS, resolvePathParams } from '../../../src/application-paths'
import { pathWithQueryParams } from '../../../src/services/query-string-builder'

describe('Memo', () => {
  beforeEach(() => {
    cy.login()
    cy.visit(
      pathWithQueryParams({
        path: resolvePathParams({ path: PATHS.content.appPath, params: { browseType: 'explorer' } }),
        newParams: { repoUrl: Cypress.env('repoUrl'), path: '/IT/Memos' },
      }),
    )
  })

  it('should create a content with the memo type', () => {
    cy.get('[data-test="add-button"]').should('not.be.disabled').click()
    cy.get('[data-test="listitem-memo"]')
      .click()
      .then(() => {
        cy.get('#Name').type('Test Memo')
        cy.contains('Submit').click()

        cy.get(`[data-test="table-cell-test-memo"]`).should('exist')
      })
  })

  it('should edit the memo', () => {
    cy.get('[data-test="table-cell-test-memo"]').rightclick({ force: true })
    cy.get('[data-test="content-context-menu-edit"]').click()
    cy.get('#Name').clear().type('Changed Test Memo')
    cy.contains('Submit').click()

    cy.get('[data-test="table-cell-changed-test-memo').should('exist')
    cy.get('[data-test="table-cell-test-memo"]').should('not.exist')
  })

  it('should delete the memo', () => {
    cy.get('[data-test="table-cell-changed-test-memo').rightclick({ force: true })
    cy.get('[data-test="content-context-menu-delete"]').click()
    cy.get('[data-test="delete-permanently"] input[type="checkbox"]').check()

    cy.get('[data-test="button-delete-confirm"]').click()

    cy.get('[data-test="table-cell-changed-test-memo').should('not.exist')
  })
})
