import { PATHS, resolvePathParams } from '../../src/application-paths'
import { pathWithQueryParams } from '../../src/services/query-string-builder'

describe('breadcrumb', () => {
  beforeEach(() => {
    cy.login()
    cy.visit(
      pathWithQueryParams({
        path: resolvePathParams({ path: PATHS.content.appPath, params: { browseType: 'explorer' } }),
        newParams: { repoUrl: Cypress.env('repoUrl'), path: '/IT/Document_Library' },
      }),
    )
  })

  it('should contain the expected items', () => {
    const expectedItems = ['Content', 'IT Workspace', 'Document library']

    cy.get('[data-test^="breadcrumb-item-"]').should('have.length', expectedItems.length)

    cy.get('[data-test^="breadcrumb-item-"]').each(($el, index) => {
      expect(expectedItems[index]).to.equal($el.text())
    })
  })

  it('should navigate in the target folder on click', () => {
    const documentLibrarySelector = '[data-test="breadcrumb-item-document-library"]'

    cy.get(documentLibrarySelector).should('exist')
    cy.get('[data-test="breadcrumb-item-it-workspace"]').click()
    cy.get('[data-test="breadcrumb-item-it-workspace"]').should('exist')
    cy.get(documentLibrarySelector).should('not.exist')

    cy.location().should((loc) => {
      const query = new URLSearchParams(loc.search)
      expect(query.get('path')).to.eq('/IT')
    })
  })

  it('right click should open a context menu', () => {
    cy.get('[data-test^="content-context-menu-"]').should('not.exist')
    cy.get('[data-test="breadcrumb-item-it-workspace"]').rightclick()
    cy.get('[data-test^="content-context-menu-"]').should('have.length.of.at.least', 1)
  })
})
