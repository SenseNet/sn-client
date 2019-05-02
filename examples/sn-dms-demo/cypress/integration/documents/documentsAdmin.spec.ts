import { openContextMenu } from '../../support/documents'

const documentName = 'Sample-document.docx'
context('The documents page with admin', () => {
  const contextMenuItems = [
    'Preview',
    'Download',
    'Rename',
    'Copy to',
    'Move to',
    'Share content',
    'Edit properties',
    'Set permissions',
    'Check out',
    'Publish',
    'Versions',
    'Delete',
  ]
  beforeEach(() => {
    cy.login('businesscat@sensenet.com', 'businesscat')
  })

  it('should check actions availability', () => {
    openContextMenu(documentName)
    contextMenuItems.forEach(item => {
      cy.get(`[title="${item}"]`).should('exist')
    })
  })

  it('should be able open viewer from context menu and close with esc', () => {
    openContextMenu(documentName)
    cy.get(`[title="${contextMenuItems[0]}"]`).click()
    cy.contains('Preview image generation is in progress').should('exist')
    cy.get('.overlay').should('exist')
    cy.get('body').type('{esc}')
    cy.get('.overlay').should('not.exist')
  })
})
