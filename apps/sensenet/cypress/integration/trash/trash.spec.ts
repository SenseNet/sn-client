import { PATHS, resolvePathParams } from '../../../src/application-paths'
import { pathWithQueryParams } from '../../../src/services/query-string-builder'

describe('Trash', () => {
  before(() => {
    cy.login()
  })

  it('deleted item should appear in the trash', () => {
    cy.visit(
      pathWithQueryParams({
        path: resolvePathParams({ path: PATHS.content.appPath, params: { browseType: 'explorer' } }),
        newParams: { repoUrl: Cypress.env('repoUrl') },
      }),
    )

    cy.get('[data-test="menu-item-it-workspace"]').click()
    cy.get('[data-test="menu-item-document-library"]').click({ force: true })
    cy.get('[data-test="add-button"]').click()
    cy.get('[data-test="listitem-folder"]')
      .click()
      .then(() => {
        cy.get('#DisplayName').type('test')
        cy.get('#Name').type('test')
        cy.contains('Submit').click()

        cy.get(`[data-test="table-cell-test"]`)
          .rightclick()
          .then(() => {
            cy.get('[data-test="content-context-menu-delete"]').click()
            cy.get('[data-test="button-delete-confirm"]').click()
            cy.get('[data-test="drawer-menu-item-trash"]').click()

            cy.get('[data-test="table-cell-test"]').should('be.visible')
          })
      })
  })

  it('should restore item from the trash', () => {
    cy.visit(
      pathWithQueryParams({
        path: resolvePathParams({ path: PATHS.trash.appPath, params: { browseType: 'explorer' } }),
        newParams: { repoUrl: Cypress.env('repoUrl') },
      }),
    )

    cy.get('[data-test="table-cell-test"]')
      .rightclick()
      .then(() => {
        cy.get('[data-test="content-context-menu-restore"]').click()
        cy.get('[data-test="restore-destination"] input')
          .invoke('val')
          .then((destination) => {
            cy.get('[data-test="restore-button"]').click()
            cy.get('[data-test="table-cell-test"]').should('not.exist')

            cy.visit(
              pathWithQueryParams({
                path: resolvePathParams({ path: PATHS.content.appPath, params: { browseType: 'explorer' } }),
                newParams: { path: destination as string },
              }),
            )
            cy.get('[data-test="table-cell-test"]').should('be.visible')
          })
      })
  })

  it('permanently deleted content should not be in the trash', () => {
    cy.visit(
      pathWithQueryParams({
        path: resolvePathParams({ path: PATHS.content.appPath, params: { browseType: 'explorer' } }),
        newParams: { repoUrl: Cypress.env('repoUrl'), path: '/IT/Document_Library' },
      }),
    )

    cy.get(`[data-test="table-cell-test"]`)
      .rightclick()
      .then(() => {
        cy.get('[data-test="content-context-menu-delete"]').click()
        cy.get('[data-test="delete-permanently"] input[type="checkbox"]').check()
        cy.get('[data-test="button-delete-confirm"]').click()

        cy.get('[data-test="table-cell-test"]').should('not.exist')

        cy.get('[data-test="drawer-menu-item-trash"]').click()
        cy.get('[data-test="table-cell-test"]').should('not.exist')
      })
  })
})
