import { PATHS, resolvePathParams } from '../../../src/application-paths'
import { pathWithQueryParams } from '../../../src/services/query-string-builder'

describe('Memo list', () => {
  beforeEach(() => {
    cy.login()
    cy.visit(
      pathWithQueryParams({
        path: resolvePathParams({ path: PATHS.content.appPath, params: { browseType: 'explorer' } }),
        newParams: { repoUrl: Cypress.env('repoUrl'), path: '/SampleWorkspace' },
      }),
    )
  })

  it('should create a content with the memo list type', () => {
    cy.get('[data-test="add-button"]').should('not.be.disabled').click()
    cy.get('[data-test="listitem-memo-list"]')
      .click()
      .then(() => {
        cy.get('#Name').type('Test Memo List')
        cy.get('#DisplayName').type('Test Memo List')
        cy.contains('Submit').click()

        cy.get(`[data-test="table-cell-test-memo-list"]`).should('exist')
      })
    cy.get('[data-test="menu-item-test-memo-list"]').click({ force: true })
    const dropdownItems = ['Memo']

    cy.checkAddItemList(dropdownItems)
  })

  it('should edit the memo list', () => {
    cy.get('[data-test="table-cell-test-memo-list"]').rightclick({ force: true })
    cy.get('[data-test="content-context-menu-edit"]').click()
    cy.get('#Name').clear().type('Changed Test Memo List')
    cy.get('#DisplayName').clear().type('Changed Test Memo List')
    cy.contains('Submit').click()

    cy.get('[data-test="table-cell-changed-test-memo-list').should('exist')
    cy.get('[data-test="table-cell-test-memo-list"]').should('not.exist')
  })

  it('should delete the memo', () => {
    cy.get('[data-test="table-cell-changed-test-memo-list').rightclick({ force: true })
    cy.get('[data-test="content-context-menu-delete"]').click()
    cy.get('[data-test="delete-permanently"] input[type="checkbox"]').check()

    cy.get('[data-test="button-delete-confirm"]').click()

    cy.get('[data-test="table-cell-changed-test-memo-list').should('not.exist')
  })
})
