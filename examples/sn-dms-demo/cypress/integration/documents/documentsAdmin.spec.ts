import { contextMenuItems, openContextMenu } from '../../support/documents'

const documentName = 'Sample-document.docx'
context('The documents page with admin', () => {
  beforeEach(() => {
    cy.login('businesscat@sensenet.com', 'businesscat')
  })

  it('should check actions availability', () => {
    openContextMenu(documentName)
    Object.keys(contextMenuItems).forEach(item => {
      cy.get(`[title="${item}"]`).should('exist')
    })
  })

  it('should be able open viewer from context menu and close with esc', () => {
    openContextMenu(documentName)
    cy.get(`[title="${contextMenuItems.preview}"]`).click()
    cy.contains('Preview image generation is in progress').should('exist')
    cy.get('.overlay').should('exist')
    cy.get('body').type('{esc}')
    cy.get('.overlay').should('not.exist')
  })
})
