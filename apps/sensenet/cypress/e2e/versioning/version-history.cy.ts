import { PATHS, resolvePathParams } from '../../../src/application-paths'
import { pathWithQueryParams } from '../../../src/services/query-string-builder'

describe('version history', () => {
  beforeEach(() => {
    cy.login()
    cy.visit(
      pathWithQueryParams({
        path: resolvePathParams({ path: PATHS.content.appPath, params: { browseType: 'explorer' } }),
        newParams: { repoUrl: Cypress.env('repoUrl'), path: '/SampleWorkspace/Document_Library' },
      }),
    )
    cy.get('[data-test="menu-item-memos"]').click({ force: true })
  })

  before(() => {
    cy.login()
    cy.visit(
      pathWithQueryParams({
        path: resolvePathParams({ path: PATHS.content.appPath, params: { browseType: 'explorer' } }),
        newParams: { repoUrl: Cypress.env('repoUrl'), path: '/SampleWorkspace/Document_Library' },
      }),
    )
    cy.get('[data-test="menu-item-memos"]').rightclick({ force: true })
    cy.get('[data-test="content-context-menu-edit').click()

    cy.get('#mui-component-select-InheritableVersioningMode').click()
    cy.get('[data-value="1"]').click()

    cy.get('#mui-component-select-InheritableApprovingMode').click()
    cy.get('[data-value="1"]').click()

    cy.contains('Submit').click()
  })

  it('should displays the appropriate values', () => {
    cy.get('[data-test="table-cell-late-memo"]').rightclick()
    cy.get('[data-test="content-context-menu-versions"]').click()

    cy.get('[data-test="viewtitle"]').should('contain', 'Versions of Late memo')

    const expectedItems = ['Version', 'Modified by', 'Comment', 'Reject reason', 'Restore']

    cy.get('[data-test="version-table-header-cell"]').should('have.length', expectedItems.length)

    cy.get('[data-test="version-table-header-cell"]').each(($el, index) => {
      expect(expectedItems[index]).to.equal($el.text())
    })

    cy.get('[data-test="version-number"]').should('have.length', 1)
  })

  it('ensure that any changes on the file does not create new version', () => {
    cy.get('[data-test="table-cell-late-memo"]').rightclick()
    cy.get('[data-test="content-context-menu-edit"]').click()

    cy.get('#mui-component-select-MemoType').click()
    cy.get('[data-value="iso"]').click()

    cy.contains('Submit').click()

    cy.get('[data-test="table-cell-late-memo"]').rightclick()
    cy.get('[data-test="content-context-menu-versions"]').click()

    cy.get('[data-test="version-number"]').should('have.length', 1).should('have.text', 'V1.0.A')
  })

  after(() => {
    cy.login()
    cy.visit(
      pathWithQueryParams({
        path: resolvePathParams({ path: PATHS.content.appPath, params: { browseType: 'explorer' } }),
        newParams: { repoUrl: Cypress.env('repoUrl'), path: '/SampleWorkspace/Document_Library' },
      }),
    )
    cy.get('[data-test="menu-item-memos"]').rightclick({ force: true })
    cy.get('[data-test="content-context-menu-edit').click()

    cy.get('#mui-component-select-InheritableVersioningMode').click()
    cy.get('[data-value="3"]').click()

    cy.get('#mui-component-select-InheritableApprovingMode').click()
    cy.get('[data-value="2"]').click()

    cy.contains('Submit').click()
  })
})
