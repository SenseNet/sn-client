import { PATHS, resolvePathParams } from '../../../src/application-paths'
import { pathWithQueryParams } from '../../../src/services/query-string-builder'

describe('breadcrumb', () => {
  beforeEach(() => {
    cy.login()
    cy.visit(
      pathWithQueryParams({
        path: resolvePathParams({ path: PATHS.content.appPath, params: { browseType: 'explorer' } }),
        newParams: { repoUrl: Cypress.env('repoUrl'), path: '' },
      }),
    )
  })

  it('should contain the expected items', () => {
    cy.get('[data-test^="breadcrumb-item-"]').should('have.length', 1)
  })

  it('should navigate in the target folder on click', () => {
    cy.get('[data-test="menu-item-sample-workspace"]').click()
    cy.get("[data-test='breadcrumb-item-sample-workspace']").should('exist')
    cy.get('[data-test="menu-item-document-library"]').click({ force: true })
    cy.get('[data-test="breadcrumb-item-document-library"]').as('docLibBreadCrumb').should('exist')
    cy.get('[data-test="menu-item-memos"]').click({ force: true })
    cy.get('[data-test="breadcrumb-item-memos"]').should('exist')

    cy.get('@docLibBreadCrumb').should('not.exist')

    cy.location().should((loc) => {
      const query = new URLSearchParams(loc.search)

      console.log(query.get('path'))

      expect(query.get('path')).to.eq('/SampleWorkspace/Memos')
    })
  })

  it('right click on a breadcrumb item should open its action menu', () => {
    cy.get('[data-test^="content-context-menu-"]').should('not.exist')
    cy.get('[data-test="breadcrumb-item-content"]').rightclick()
    cy.get('[data-test^="content-context-menu-"]').should('have.length.of.at.least', 1)
  })
})
