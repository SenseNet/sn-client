import { pathWithQueryParams } from '../../src/services/query-string-builder'

describe('Users menu', () => {
  context('Data Output', () => {
    beforeEach(() => {
      cy.login()
      cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
      cy.get('[data-test="drawer-menu-item-users-and-groups"]').click()
      cy.viewport(1920, 1080)
    })

    it('ensures that domains are listed', () => {
      cy.intercept(/OpenTree?/).as('Tree')
      cy.wait('@Tree').then(({ response }) => {
        const result = response?.body?.d?.results?.filter((item: any) => item.Type === 'Domain')
        cy.get('.ReactVirtualized__Grid.ReactVirtualized__List>.ReactVirtualized__Grid__innerScrollContainer')
          .children('ul')
          .should('have.length', result.length)
      })
    })
  })

  context('Functionality test', () => {
    beforeEach(() => {
      cy.login()
      cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
      cy.get('[data-test="drawer-menu-item-users-and-groups"]').click()
      cy.get('[data-test="menu-item-public"]').click()
      cy.viewport(1920, 1080)
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
      cy.get("[data-test='table-cell-business-cat']").should('exist')
      cy.get("[data-test='table-cell-developer-dog']").should('exist')
    })

    it('ensures that right click on a user opens context-menu', () => {
      // Checks for users
      cy.get('.ReactVirtualized__Table .ReactVirtualized__Table__Grid .ReactVirtualized__Table__row').as('UserRows')

      // Select Developer Dog
      cy.get("[data-test='table-cell-developer-dog']").should('exist').rightclick()

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
      cy.get("[data-test='table-cell-developer-dog']").should('exist').dblclick()

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
        url: 'odata.svc/Root/Trash?*',
      }).as('getTrashChildren')

      cy.get('[data-test="table-cell-developer-dog"]')
        .rightclick()
        .then(() => {
          cy.get('[data-test="content-context-menu-delete"]').click()
          cy.get('[data-test="button-delete-confirm"]').click()

          cy.get('[data-test="table-cell-developer-dog"]').should('not.exist')

          cy.get('[data-test="drawer-menu-item-trash"]').click()

          cy.wait('@getTrashChildren').then((_interception) => {
            cy.get('[data-test="table-cell-developer-dog"]').should('not.exist')
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

      cy.get('[data-test="add-button"]').should('not.be.disabled').click({ force: true })

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
      cy.get('[data-test="switcher-developer-dog"').as('StatusSwitcher')
      cy.get('@StatusSwitcher').click()

      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(3000)

      cy.get('@StatusSwitcher').find('.MuiSwitch-input').first().should('be.checked')
    })

    it('ensures that adding to a group is working properly', () => {
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(2000)

      cy.get('[data-test="drawer-menu-item-users-and-groups"]').click()
      cy.get('[data-test="groups"]').click()
      cy.get(`[data-test="developers-members"]`).click()
      cy.get('[data-test="reference-input"]').type('Developer D')
      cy.get('[data-test="suggestion-developer-dog"]').click()
      cy.get('[data-test="reference-add-button"]').click()
      cy.get('[data-test="reference-list"] li')
        .should('have.length', 1)
        .each(($el) => {
          expect('Developer Dog').to.include($el.children().eq(0).children().eq(1).text())
        })
    })
  })
})
