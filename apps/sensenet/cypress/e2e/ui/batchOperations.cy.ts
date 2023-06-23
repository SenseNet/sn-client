import { PATHS, resolvePathParams } from '../../../src/application-paths'
import { pathWithQueryParams } from '../../../src/services/query-string-builder'

describe('Batch operations: ', () => {
  beforeEach(() => {
    cy.login()
    cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
  })

  it('multiple content copy works as it is intended', () => {
    cy.visit(
      pathWithQueryParams({
        path: resolvePathParams({ path: PATHS.content.appPath, params: { browseType: 'explorer' } }),
        newParams: { repoUrl: Cypress.env('repoUrl'), path: '/SampleWorkspace/Document_Library' },
      }),
    )

    cy.get('[data-test="table-row-selection-control-dinnerscookbook.pdf"]').click({ force: true })
    cy.get('[data-test="table-row-selection-control-hello_world.docx"]')
      .find('input[type="checkbox"]')
      .check({ force: true })
    cy.get('[data-test="batch-copy"]').click()
    cy.get('[data-test="picker-checkbox-item-books"]').click()
    cy.get('[data-test="picker-submit"]').click()
    cy.get('[data-test="snackbar-message"]').should('contain.text', '2 items has been copied to')
    cy.get('[data-test="table-cell-dinnerscookbook.pdf"]').should('exist')
    cy.get('[data-test="table-cell-hello_world.docx"]').should('exist')
    cy.get('[data-test="menu-item-books"]').click({ force: true })
    cy.get('[data-test="table-cell-dinnerscookbook.pdf"]').should('exist')
    cy.get('[data-test="table-cell-hello_world.docx"]').should('exist')
  })

  it('multiple content delete works as it is intended', () => {
    cy.visit(
      pathWithQueryParams({
        path: resolvePathParams({ path: PATHS.content.appPath, params: { browseType: 'explorer' } }),
        newParams: { repoUrl: Cypress.env('repoUrl'), path: '/SampleWorkspace/Document_Library/books' },
      }),
    )

    cy.get('[data-test="table-row-selection-control-dinnerscookbook.pdf"]').click({ force: true })
    cy.get('[data-test="table-row-selection-control-hello_world.docx"]')
      .find('input[type="checkbox"]')
      .check({ force: true })
    cy.get('[data-test="batch-delete"]').click()
    cy.get('[data-test="delete-permanently"] input[type="checkbox"]').check()
    cy.get('[data-test="button-delete-confirm"]').click()
    cy.get('[data-test="table-cell-dinnerscookbook.pdf"]').should('not.exist')
    cy.get('[data-test="table-cell-hello_world.docx"]').should('not.exist')
  })

  it('multiple content move works as it is intended', () => {
    cy.visit(
      pathWithQueryParams({
        path: resolvePathParams({ path: PATHS.content.appPath, params: { browseType: 'explorer' } }),
        newParams: { repoUrl: Cypress.env('repoUrl'), path: '/SampleWorkspace/Document_Library' },
      }),
    )

    cy.get('[data-test="table-row-selection-control-dinnerscookbook.pdf"]').click({ force: true })
    cy.get('[data-test="table-row-selection-control-hello_world.docx"]')
      .find('input[type="checkbox"]')
      .check({ force: true })
    cy.get('[data-test="batch-move"]').click()
    cy.get('[data-test="picker-checkbox-item-books"]').click()
    cy.get('[data-test="picker-submit"]').click()
    cy.get('[data-test="snackbar-message"]').should('contain.text', '2 items has been moved to')
    cy.get('[data-test="table-cell-dinnerscookbook.pdf"]').should('not.exist')
    cy.get('[data-test="table-cell-hello_world.docx"]').should('not.exist')
    cy.get('[data-test="menu-item-books"]').click({ force: true })
    cy.get('[data-test="table-cell-dinnerscookbook.pdf"]').should('exist')
    cy.get('[data-test="table-cell-hello_world.docx"]').should('exist')

    //put it back

    cy.get('[data-test="table-row-selection-control-dinnerscookbook.pdf"]').click({ force: true })
    cy.get('[data-test="table-row-selection-control-hello_world.docx"]')
      .find('input[type="checkbox"]')
      .check({ force: true })
    cy.get('[data-test="batch-move"]').click()
    cy.get('[data-test="picker-up"]').dblclick()
    cy.get('[data-test="picker-submit"]').click()
    cy.get('[data-test="snackbar-message"]').should('contain.text', '2 items has been moved to')
    cy.get('[data-test="table-cell-dinnerscookbook.pdf"]').should('not.exist')
    cy.get('[data-test="table-cell-hello_world.docx"]').should('not.exist')
  })
})
