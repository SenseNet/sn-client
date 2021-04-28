import { pathWithQueryParams } from '../../src/services/query-string-builder'

describe('Users menu', () => {
  beforeEach(() => {
    cy.login()
    cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
    cy.get('[data-test="drawer-menu-item-users-and-groups"]').click()
  })

  it('ensures that users list has the appropriate data', () => {
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
    // Checks for users
    cy.get('.ReactVirtualized__Table .ReactVirtualized__Table__Grid .ReactVirtualized__Table__row').as('UserRows')

    // Select Developer Dog
    cy.get('@UserRows').contains('Developer Dog').dblclick()

    // Check if the required title exist
    cy.get('[data-test="viewtitle"]').as('Title').should('contain.text', 'Edit Developer Dog')
    cy.get('form').within(() => {
      cy.get('input[name="FullName"]').should('have.value', 'Developer Dog')
    })
    cy.get('[data-test="cancel"]').click()
  })

  it('ensures that deletion of users is working properly', () => {
    cy.intercept({
      method: 'GET',
      url: '/Root/Trash',
    }).as('getTrashChildren')

    cy.get('[data-test="table-cell-developer-dog"]')
      .rightclick()
      .then(() => {
        cy.get('[data-test="content-context-menu-delete"]').click()
        cy.get('[data-test="button-delete-confirm"]').click()

        cy.get('[data-test="table-celll-developer-dog"]').should('not.exist')

        cy.get('[data-test="drawer-menu-item-trash"]').click()

        cy.wait('@getTrashChildren').then((_interception) => {
          cy.get('[data-test="table-celll-developer-dog"]').should('not.exist')
        })
      })
  })

  it('ensures that the creation of a new users is working properly', () => {
    const newUser = {
      loginName: 'devdog',
      fullName: 'Developer Dog',
      email: 'devdog@sensenet.com',
      password: 'devdog',
    }

    cy.get('[data-test="add-button"]').should('not.be.disabled').click()

    cy.get('[data-test="listitem-user"]')
      .click()
      .then(() => {
        cy.get('[data-test="viewtitle"]').should('contain.text', 'New User')

        cy.get('#LoginName').type(newUser.loginName)
        cy.get('#FullName').type(newUser.fullName)
        cy.get('#Email').type(newUser.email)
        cy.get('#Password').type(newUser.password)

        cy.contains('Submit').click()

        cy.get('[data-test="snackbar-close"]').click()
        cy.get(`[data-test="table-cell-${newUser.fullName.replace(/\s+/g, '-').toLowerCase()}`).should(
          'have.text',
          newUser.fullName,
        )
      })
  })

  it('ensures that we can enable a user by clicking on its status checkbox in the User list', () => {
    cy.get(`[data-test="switcher-${'Developer Dog'.replace(/\s+/g, '-').toLowerCase()}`).as('StatusSwitcher')
    cy.get('@StatusSwitcher').click()
    cy.get('@StatusSwitcher').find('.MuiSwitch-input').first().should('be.checked')
  })
})
