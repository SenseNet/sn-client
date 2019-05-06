import Chance = require('chance')
import { contextMenuItems, openContextMenu } from '../../support/documents'

context('The documents page', () => {
  /**
   * Change this to registered user once the test run for the first time to prevent new registration.
   * @example ```js
   * { email: 'miwor@sensenet.com', password: 'aY]w9UJ2j' }```
   */
  let currentUser = { email: '', password: '' }
  const newMenuItems = [
    { name: 'document', ext: '.docx' },
    { name: 'sheet', ext: '.xlsx' },
    { name: 'slide', ext: '.pptx' },
    { name: 'text', ext: '.txt' },
    { name: 'folder', ext: '' },
  ]
  before(async () => {
    if (process.env.CI) {
      currentUser = registerNewUser()
    }
  })

  beforeEach(() => {
    cy.login(currentUser.email, currentUser.password).then(isSuccesful => {
      if (!isSuccesful) {
        currentUser = registerNewUser()
        cy.login(currentUser.email, currentUser.password)
      }
    })
  })

  it('header contains the logged in users avatar', () => {
    cy.visit('#/documents')

    cy.url().should('include', '/documents')

    cy.get(`div[aria-label="${currentUser.email}"]`).should('exist')
  })

  describe('left side menu', () => {
    it('should contain new and upload buttons', () => {
      cy.contains('span[role=button]', 'Upload')
      cy.contains('span[role=button]', 'New')
    })

    it('should contain new document, image, sheet, slide, text, folder buttons', () => {
      cy.contains('[data-cy=appbar]', 'Document library').should('exist')
      cy.contains('New').click()
      newMenuItems.forEach(item => cy.contains('li[role=menuitem]', 'New ' + item.name))
    })

    it(`creating a new item should show succes notification and can be found in the grid`, () => {
      cy.contains('Document library').should('exist')
      newMenuItems.forEach(item => {
        openNew(item.name)
        const displayName = Chance().word()
        cy.get('#DisplayName').type(displayName + '{enter}')
        cy.contains(displayName + item.ext + ' is successfully created').should('exist')
        cy.contains(displayName + item.ext).should('exist')
        cy.get('[aria-label="Close"]').click()
      })
    })
  })

  it('should rename a document', () => {
    const fileName = 'logo.png'
    const newName = 'newName.png'
    cy.uploadWithApi({
      parentPath: `Root/Profiles/Public/${currentUser.email}/Document_Library`,
      fileName,
    })
    cy.contains(fileName).should('exist')
    openContextMenu(fileName)
    cy.get(`[title="${contextMenuItems.rename}"]`).click()
    // wait for input to be focused
    cy.wait(1000)
    cy.get('.rename')
      .clear()
      .type(`${newName}{enter}`)
    cy.contains(newName)
    cy.contains(`The content '${fileName}' has been modified`)
  })
})

const openNew = (action: string) => {
  cy.contains('Documents').click()
  cy.contains('New').click()
  cy.get(`[title="New ${action}"]`).click()
}

const registerNewUser = () => {
  const chance = new Chance()
  const currentUser = { email: chance.email({ domain: 'sensenet.com' }), password: chance.string() }
  cy.registerUser(currentUser.email, currentUser.password)
  return currentUser
}
