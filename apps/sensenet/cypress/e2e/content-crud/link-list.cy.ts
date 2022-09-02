import { PATHS, resolvePathParams } from '../../../src/application-paths'
import { pathWithQueryParams } from '../../../src/services/query-string-builder'

describe('Link list', () => {
  beforeEach(() => {
    cy.login()
    cy.visit(
      pathWithQueryParams({
        path: resolvePathParams({ path: PATHS.content.appPath, params: { browseType: 'explorer' } }),
        newParams: { repoUrl: Cypress.env('repoUrl'), path: '/IT' },
      }),
    )
  })

  it('should create a content with the link list type', () => {
    cy.get('[data-test="add-button"]').should('not.be.disabled').click()
    cy.get('[data-test="listitem-link-list"]')
      .click()
      .then(() => {
        cy.get('#DisplayName').type('Test Link List')
        cy.contains('Submit').click()

        cy.get(`[data-test="table-cell-test-link-list"]`).should('exist')
      })
    cy.get('[data-test="menu-item-test-link-list"]').click({ force: true })
    cy.get('[data-test="add-button"]')
      .click()
      .then(() => {
        const expetcedMenuItems = ['Link']
        cy.get('[data-test="list-items"]')
          .children()
          .should('have.length', expetcedMenuItems.length)
          .each(($span) => {
            const text = $span.text()
            if (text) {
              expect(expetcedMenuItems).to.include(text)
            }
          })
      })
  })

  it('should edit the link list', () => {
    cy.get('[data-test="table-cell-test-link-list"]').rightclick({ force: true })
    cy.get('[data-test="content-context-menu-edit"]').click()
    cy.get('#DisplayName').clear().type('Changed Test Link List')
    cy.contains('Submit').click()

    cy.get('[data-test="table-cell-changed-test-link-list').should('exist')
    cy.get('[data-test="table-cell-test-link-list"]').should('not.exist')
  })

  it('should delete the link', () => {
    cy.get('[data-test="table-cell-changed-test-link-list').rightclick({ force: true })
    cy.get('[data-test="content-context-menu-delete"]').click()
    cy.get('[data-test="delete-permanently"] input[type="checkbox"]').check()

    cy.get('[data-test="button-delete-confirm"]').click()

    cy.get('[data-test="table-cell-changed-test-link-list').should('not.exist')
  })
})
