import { PATHS, resolvePathParams } from '../../src/application-paths'
import { pathWithQueryParams } from '../../src/services/query-string-builder'

describe('Organizational units', () => {
  beforeEach(() => {
    cy.login()
    cy.visit(
      pathWithQueryParams({
        path: resolvePathParams({ path: PATHS.usersAndGroups.appPath, params: { browseType: 'explorer' } }),
        newParams: { repoUrl: Cypress.env('repoUrl') },
      }),
    )
  })

  it('ensure that creating a new org unit works as it is expected', () => {
    cy.get('[data-test="add-button"]').should('not.be.disabled').click()
    cy.get('[data-test="listitem-organizational-unit"]')
      .click()
      .then(() => {
        cy.get('#Name').type('test1')
        cy.contains('Submit').click()

        cy.get('[data-test="snackbar-close"]').click()
        cy.get(`[data-test="menu-item-test1"]`).should('exist')
      })
  })

  it('ensure that organizational units build a tree', () => {
    cy.get(`[data-test="menu-item-test1"]`).click()

    cy.get('[data-test="add-button"]').should('not.be.disabled').click()
    cy.get('[data-test="listitem-organizational-unit"]')
      .click()
      .then(() => {
        cy.get('#Name').type('test2')
        cy.contains('Submit').click()

        cy.get(`[data-test="menu-item-test1"]`).then((element) => {
          const paddingLeftOfParent = element.css('padding-left')

          cy.get(`[data-test="menu-item-test2"]`).should('exist')
          cy.get(`[data-test="menu-item-test1"]`).should('have.class', 'Mui-selected')

          cy.get(`[data-test="menu-item-test2"]`).should((nestedElement) => {
            expect(nestedElement).to.have.css('padding-left', `${parseInt(paddingLeftOfParent, 10) + 20}px`)
          })
        })
      })
  })

  it('ensure that organizational units tree is deletable', () => {
    cy.get(`[data-test="menu-item-test1"]`).click().rightclick()

    cy.get('[data-test="content-context-menu-delete"]').click()
    cy.get('[data-test="delete-permanently"] input[type="checkbox"]').check()
    cy.get('[data-test="button-delete-confirm"]').click()

    cy.get('[data-test="menu-item-test1]').should('not.exist')
    cy.get('[data-test="menu-item-test2]').should('not.exist')
  })
})
