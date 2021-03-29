import { pathWithQueryParams } from '../../../src/services/query-string-builder'

const contextMenuItems = ['browse', 'copyto', 'edit', 'moveto', 'delete']
describe('Groups', () => {
  before(() => {
    cy.login()
    cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
  })
  it('Groups list should have the appropriate data', () => {
    const items = ['Administrators', 'Developers', 'Editors']
    const columns = ['DisplayName', 'Description', 'Members', 'Actions']
    cy.get('[data-test="drawer-menu-item-users-and-groups"]').click()
    cy.get('[data-test="groups"]').click()
    items.forEach((item) => {
      cy.get(`[data-test="table-cell-${item.replace(/\s+/g, '-').toLowerCase()}"]`).should('be.visible')
    })
    columns.forEach((column) => {
      cy.get(`[data-test="table-header-${column.replace(/\s+/g, '-').toLowerCase()}"]`).should('be.visible')
    })
  })
  it('right click on a group should open context-menu', () => {
    cy.get('[data-test="drawer-menu-item-users-and-groups"]').click()
    cy.get('[data-test="groups"]').click()
    cy.get('[data-test="table-cell-editors"]')
      .rightclick()
      .then(() => {
        contextMenuItems.forEach((item) => {
          cy.get(`[data-test="content-context-menu-${item.replace(/\s+/g, '-').toLowerCase()}"]`).should('be.visible')
        })
        cy.get('body').click()
      })
  })
  it('Double click on group should open a edit form of the content', () => {
    cy.get('[data-test="drawer-menu-item-users-and-groups"]').click()
    cy.get('[data-test="groups"]').click()
    cy.get('[data-test="table-cell-editors"]').dblclick()
    cy.get('[data-test="viewtitle"').should('have.text', 'Edit Editors')
    cy.get('[data-test="cancel"]').click()
  })

  it('ensures that creation of a new group is working properly', () => {
    const groupName = 'test'

    cy.get('[data-test="drawer-menu-item-users-and-groups"]').click()

    cy.get('[data-test="groups"]').click()
    cy.get('[data-test="add-button"]').should('not.be.disabled').click()

    cy.get('[data-test="listitem-group"]')
      .click()
      .then(() => {
        cy.get('[data-test="viewtitle"]').should('contain.text', 'New Group')

        cy.get('#Name').type(groupName)

        cy.contains('Submit').click()

        cy.get('[data-test="snackbar-close"]').click()
        cy.get(`[data-test="table-cell-${groupName}`).should('have.text', groupName)
      })
  })

  it('ensures that deletion of a group is working properly', () => {
    cy.intercept({
      method: 'GET',
      url: '/Root/Trash',
    }).as('getTrashChildren')

    cy.get('[data-test="drawer-menu-item-users-and-groups"]').click()

    cy.get('[data-test="groups"]').click()
    cy.get('[data-test="table-cell-test"]')
      .rightclick()
      .then(() => {
        cy.get('[data-test="content-context-menu-delete"]').click()
        cy.get('[data-test="button-delete-confirm"]').click()

        cy.get('[data-test="table-cell-test"]').should('not.exist')

        cy.get('[data-test="drawer-menu-item-trash"]').click()

        cy.wait('@getTrashChildren').then((_interception) => {
          cy.get('[data-test="table-cell-test"]').should('not.exist')
        })
      })
  })
})
