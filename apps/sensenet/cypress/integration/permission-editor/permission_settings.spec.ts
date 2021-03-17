import { pathWithQueryParams } from '../../../src/services/query-string-builder'

const newSettings =
  '{"groups":[{"See":["See"]},{"Read":["Preview","PreviewWithoutWatermark","PreviewWithoutRedaction","Open"]},{"Write":["Save","AddNew","Delete"]},{"Versioning":["OpenMinor","Publish","ForceCheckin","Approve","RecallOldVersion"]},{"Advanced":["SeePermissions","SetPermissions","RunApplication"]}]}'

const defaultSettings =
  '{"groups":[{"Read":["See","Preview","PreviewWithoutWatermark","PreviewWithoutRedaction","Open"]},{"Write":["Save","AddNew","Delete"]},{"Versioning":["OpenMinor","Publish","ForceCheckin","Approve","RecallOldVersion"]},{"Advanced":["SeePermissions","SetPermissions","RunApplication"]}]}'
describe('Permission.settings effect on permission dialog', () => {
  beforeEach(() => {
    cy.login()
    cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
  })

  it('adding a new group in Permission.settings file should appear on permission editor dialog', () => {
    cy.get('[data-test="drawer-menu-item-settings"]').click()
    cy.get('[data-test="drawer-submenu-item-configuration"]').click()
    cy.get('[data-test="permission.settings-edit-button"]').click()
    cy.get('.react-monaco-editor-container textarea')
      .click({ force: true })
      .clear()
      .focused()
      .type(newSettings, { parseSpecialCharSequences: false })
    cy.get('[data-test="monaco-editor-submit"]').click()
    cy.get('[data-test="drawer-menu-item-content"]').click()
    cy.get('[data-test="menu-item-it-workspace"]').rightclick()
    cy.get('[data-test="content-context-menu-setpermissions"]').click()
    cy.get('[data-test="set-on-this-visitors"]').click()

    //check the permission groups
    cy.get('[data-test="permission-group-see"]').should('be.visible')
    cy.get('[data-test="permission-group-read"]').should('be.visible')
    cy.get('[data-test="permission-group-write"]').should('be.visible')
    cy.get('[data-test="permission-group-versioning"]').should('be.visible')
    cy.get('[data-test="permission-group-advanced"]').should('be.visible')

    //check See permission group
    cy.get('[data-test="permission-group-see"]').click()
    cy.get('[data-test="permission-item-see"]').should('be.visible')

    //check Read permission group
    cy.get('[data-test="permission-group-read"]').click()
    cy.get('[data-test="permission-item-preview"]').should('be.visible')
    cy.get('[data-test="permission-item-previewwithoutwatermark"]').should('be.visible')
    cy.get('[data-test="permission-item-previewwithoutredaction"]').should('be.visible')
    cy.get('[data-test="permission-item-open"]').should('be.visible')

    //check Write permission group
    cy.get('[data-test="permission-group-write"]').click()
    cy.get('[data-test="permission-item-save"]').should('be.visible')
    cy.get('[data-test="permission-item-addnew"]').should('be.visible')
    cy.get('[data-test="permission-item-delete"]').should('be.visible')

    //check Versioning permission group
    cy.get('[data-test="permission-group-versioning"]').click()
    cy.get('[data-test="permission-item-openminor"]').should('be.visible')
    cy.get('[data-test="permission-item-publish"]').should('be.visible')
    cy.get('[data-test="permission-item-forcecheckin"]').should('be.visible')
    cy.get('[data-test="permission-item-approve"]').should('be.visible')
    cy.get('[data-test="permission-item-recalloldversion"]').should('be.visible')

    //check Advanced permission group  SeePermissions", "SetPermissions", "RunApplication"
    cy.get('[data-test="permission-group-advanced"]').click()
    cy.get('[data-test="permission-item-seepermissions"]').should('be.visible')
    cy.get('[data-test="permission-item-setpermissions"]').should('be.visible')
    cy.get('[data-test="permission-item-runapplication"]').should('be.visible')
  })

  it('removing a group in Permission.settings file should disappear on permission editor dialog', () => {
    cy.get('[data-test="drawer-menu-item-settings"]').click()
    cy.get('[data-test="drawer-submenu-item-configuration"]').click()
    cy.get('[data-test="permission.settings-edit-button"]').click()
    cy.get('.react-monaco-editor-container textarea')
      .click({ force: true })
      .clear()
      .focused()
      .type(defaultSettings, { parseSpecialCharSequences: false })
    cy.get('[data-test="monaco-editor-submit"]').click()
    cy.get('[data-test="drawer-menu-item-content"]').click()
    cy.get('[data-test="menu-item-it-workspace"]').rightclick()
    cy.get('[data-test="content-context-menu-setpermissions"]').click()
    cy.get('[data-test="set-on-this-visitors"]').click()

    //check the permission groups
    cy.get('[data-test="permission-group-read"]').should('be.visible')
    cy.get('[data-test="permission-group-write"]').should('be.visible')
    cy.get('[data-test="permission-group-versioning"]').should('be.visible')
    cy.get('[data-test="permission-group-advanced"]').should('be.visible')

    //check Read permission group
    cy.get('[data-test="permission-item-see"]').should('be.visible')
    cy.get('[data-test="permission-item-preview"]').should('be.visible')
    cy.get('[data-test="permission-item-previewwithoutwatermark"]').should('be.visible')
    cy.get('[data-test="permission-item-previewwithoutredaction"]').should('be.visible')
    cy.get('[data-test="permission-item-open"]').should('be.visible')

    //check Write permission group
    cy.get('[data-test="permission-group-write"]').click()
    cy.get('[data-test="permission-item-save"]').should('be.visible')
    cy.get('[data-test="permission-item-addnew"]').should('be.visible')
    cy.get('[data-test="permission-item-delete"]').should('be.visible')

    //check Versioning permission group
    cy.get('[data-test="permission-group-versioning"]').click()
    cy.get('[data-test="permission-item-openminor"]').should('be.visible')
    cy.get('[data-test="permission-item-publish"]').should('be.visible')
    cy.get('[data-test="permission-item-forcecheckin"]').should('be.visible')
    cy.get('[data-test="permission-item-approve"]').should('be.visible')
    cy.get('[data-test="permission-item-recalloldversion"]').should('be.visible')

    //check Advanced permission group  SeePermissions", "SetPermissions", "RunApplication"
    cy.get('[data-test="permission-group-advanced"]').click()
    cy.get('[data-test="permission-item-seepermissions"]').should('be.visible')
    cy.get('[data-test="permission-item-setpermissions"]').should('be.visible')
    cy.get('[data-test="permission-item-runapplication"]').should('be.visible')
  })
})
