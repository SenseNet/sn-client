import { pathWithQueryParams } from '../../src/services/query-string-builder'

describe('Users menu', () => {
  beforeEach(() => {
    cy.login()
    cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
  })

  it('ensures that users list has the appropriate data', () => {
    cy.get('[data-test="drawer-menu-item-Users and groups"]').as('UsersAndGroupsIcon')
    cy.get('@UsersAndGroupsIcon').click()
    cy.get('.ReactVirtualized__Table>.ReactVirtualized__Table__headerRow>.ReactVirtualized__Table__headerColumn').as(
      'ColumnHeaders',
    )

    // Checks for header columns
    cy.get('@ColumnHeaders').children('.DisplayName').should('exist')
    cy.get('@ColumnHeaders').children('.Email').should('exist')
    cy.get('@ColumnHeaders').children('.AllRoles').should('exist')
    cy.get('@ColumnHeaders').children('.Enabled').should('exist')
    cy.get('@ColumnHeaders').children('.Actions').should('exist')

    // Checks for users
    cy.get('.ReactVirtualized__Table .ReactVirtualized__Table__Grid .ReactVirtualized__Table__row').as('UserRows')
    cy.get('@UserRows').contains('Business Cat').should('have.length', 1)
    cy.get('@UserRows').contains('Developer Dog').should('have.length', 1)
  })

  it('ensures that right click on a user opens context-menu', () => {
    cy.get('[data-test="drawer-menu-item-Users and groups"]').as('UsersAndGroupsIcon')
    cy.get('@UsersAndGroupsIcon').click()

    // Checks for users
    cy.get('.ReactVirtualized__Table .ReactVirtualized__Table__Grid .ReactVirtualized__Table__row').as('UserRows')

    // Select Developer Dog
    cy.get('@UserRows').contains('Developer Dog').rightclick()

    // Check if the required actions exist
    cy.get('[data-test="content-context-menu-browse"]').as('BrowseAction').should('exist')
    cy.get('[data-test="content-context-menu-copyto"]').as('CopyToAction').should('exist')
    cy.get('[data-test="content-context-menu-edit"]').as('EditAction').should('exist')
    cy.get('[data-test="content-context-menu-moveto"]').as('MoveToAction').should('exist')
    cy.get('[data-test="content-context-menu-delete"]').as('DeleteAction').should('exist')

    // Click away
    cy.get('body').click(0, 0)
  })

  it('ensures that double click on a user opens an edit form of the content', () => {
    cy.get('[data-test="drawer-menu-item-Users and groups"]').as('UsersAndGroupsIcon')
    cy.get('@UsersAndGroupsIcon').click()

    // Checks for users
    cy.get('.ReactVirtualized__Table .ReactVirtualized__Table__Grid .ReactVirtualized__Table__row').as('UserRows')

    // Select Developer Dog
    cy.get('@UserRows').contains('Developer Dog').dblclick()

    // Check if the required title exist
    cy.get('[data-test="viewtitle"]').as('Title').should('contain.text', 'Edit Developer Dog')
    cy.get('form').within(($form) => {
      cy.get('input[name="FullName"]').should('have.value', 'Developer Dog')
    })
    cy.get('[data-test="cancel"]').click()
  })
})
