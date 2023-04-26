import { pathWithQueryParams } from '../../../src/services/query-string-builder'

describe('Permission editor group switcher and force relations', () => {
  before(() => {
    cy.login()
    cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
  })

  it('switching a group switcher influences the permission items', () => {
    cy.get('[data-test="drawer-menu-item-content"]').click()
    cy.get('[data-test*="-workspace"]').eq(0).rightclick()
    cy.get('[data-test="content-context-menu-setpermissions"]').click()
    cy.get('[data-test="set-on-this-administrators"]').click()

    cy.setGroupPermission('read', 'allow')
    cy.setGroupPermission('read', 'deny')

    cy.setGroupPermission('write', 'allow')
    cy.setGroupPermission('write', 'deny')
    cy.setGroupPermission('versioning', 'allow')
    cy.setGroupPermission('versioning', 'deny')
    cy.setGroupPermission('advanced', 'allow')
    cy.setGroupPermission('advanced', 'deny')

    cy.setGroupPermission('read', 'undefined')
    cy.setGroupPermission('write', 'undefined')
    cy.setGroupPermission('versioning', 'undefined')
    cy.setGroupPermission('advanced', 'undefined')
  })

  it('force relations should work properly', () => {
    cy.get('[data-test="permission-group-read"]').click()

    cy.get('[data-test="read-group-permissions"]').as('readGroupPermissions')
    cy.get('@readGroupPermissions').find('[data-test="permission-item-open"]').as('openPermission')

    cy.get('@openPermission').find('[data-test="allow"]').click()

    cy.get(`[data-test="read-group-permissions"] input[value="allow"]`).should('be.checked')

    cy.get('@readGroupPermissions').find('[data-test="permission-item-see"]').as('seePermission')

    cy.get('@seePermission').find('[data-test="undefined"]').click()

    cy.get(`[data-test="read-group-permissions"] input[value="undefined"]`).should('be.checked')

    cy.get('@seePermission').find('[data-test="deny"]').click()

    cy.get(`[data-test="permission-group-read"] [data-test="permission-switcher"] input[value="deny"]`).should(
      'be.checked',
    )
    cy.get(`[data-test="permission-group-write"] [data-test="permission-switcher"] input[value="deny"]`).should(
      'be.checked',
    )
    cy.get(`[data-test="permission-group-versioning"] [data-test="permission-switcher"] input[value="deny"]`).should(
      'be.checked',
    )
  })
})
