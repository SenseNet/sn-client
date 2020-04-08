import {
  contextMenuItems,
  createNewFileName,
  openContextMenu,
  uploadNewFileAndOpenContextMenuItem,
} from '../../support/documents'

context('The documents page with admin', () => {
  const adminUser = {
    username: 'e2eadmin',
    password: 'e2eadmin',
    doclibPath: 'Root/Content/IT/Document_Library',
  }
  beforeEach(() => {
    cy.login(adminUser.username, adminUser.password)
  })

  it('should check actions availability', () => {
    const fileName = createNewFileName()
    cy.uploadWithApi({
      parentPath: adminUser.doclibPath,
      fileName,
    })
    cy.contains('div', fileName, { timeout: 10000 }).should('exist')
    openContextMenu(fileName)
    Object.keys(contextMenuItems).forEach((item) => {
      if (item === 'checkIn' || item === 'undoChanges') {
        return
      }
      cy.get(`[title="${contextMenuItems[item]}"]`).should('exist')
    })
  })

  it('should be able to open viewer from context menu and close with esc', () => {
    const fileName = createNewFileName()
    cy.uploadWithApi({
      parentPath: adminUser.doclibPath,
      fileName,
    })
    cy.contains('div', fileName, { timeout: 10000 }).should('exist')
    openContextMenu(fileName)
    cy.get(`[title="${contextMenuItems.preview}"]`).click()
    cy.contains('Preview image generation is in progress').should('exist')
    cy.get('.overlay').should('exist')
    cy.get('body').type('{esc}')
    cy.get('.overlay').should('not.exist')
  })

  describe('share context menu', () => {
    it('should list valid emails', () => {
      const fileName = createNewFileName()
      uploadNewFileAndOpenContextMenuItem('e2e-admin', fileName, contextMenuItems.shareContent)
      cy.get('form input[type="email"]').type('invalid{enter}')
      cy.contains('invalid').should('not.exist')
      cy.get('form input[type="email"]').clear().type('asd@asd.com{enter}')
      cy.contains('asd@asd.com').should('exist')
      cy.contains('button', 'Ok').click()
      openContextMenu(fileName)
      cy.get(`[title="${contextMenuItems.shareContent}"]`).click()
      cy.contains('asd@asd.com').should('exist')
    })
  })
})
