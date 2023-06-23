import { PATHS, resolvePathParams } from '../../../src/application-paths'
import { pathWithQueryParams } from '../../../src/services/query-string-builder'

describe('Link', () => {
  beforeEach(() => {
    cy.login()
    cy.visit(
      pathWithQueryParams({
        path: resolvePathParams({ path: PATHS.content.appPath, params: { browseType: 'explorer' } }),
        newParams: { repoUrl: Cypress.env('repoUrl'), path: '/SampleWorkspace' },
      }),
    )
  })

  it('should create a content with the Document Library type', () => {
    const dropdownItems = ['Upload', 'Folder', 'File']

    cy.get('[data-test="add-button"]').should('not.be.disabled').click()
    cy.get('[data-test="listitem-document-library"]')
      .click()
      .then(() => {
        cy.get('#DisplayName').type('Test Document Library')
        cy.contains('Submit').click()

        cy.get(`[data-test="table-cell-test-document-library"]`).should('exist')

        cy.get('[data-test="menu-item-test-document-library"]').click({ force: true })
        cy.checkAddItemList(dropdownItems)
      })
  })

  it('should edit the test document library', () => {
    cy.get('[data-test="table-cell-test-document-library"]').rightclick({ force: true })
    cy.get('[data-test="content-context-menu-edit"]').click()
    cy.get('#DisplayName').clear().type('Changed Test Document Library')
    cy.contains('Submit').click()

    cy.get('[data-test="table-cell-changed-test-document-library').should('exist')
    cy.get('[data-test="table-cell-test-document-library"]').should('not.exist')
  })

  it('should delete the test document library', () => {
    cy.get('[data-test="table-cell-changed-test-document-library').rightclick({ force: true })
    cy.get('[data-test="content-context-menu-delete"]').click()
    cy.get('[data-test="delete-permanently"] input[type="checkbox"]').check()

    cy.get('[data-test="button-delete-confirm"]').click()

    cy.get('[data-test="table-cell-changed-test-document-library').should('not.exist')
  })
})
