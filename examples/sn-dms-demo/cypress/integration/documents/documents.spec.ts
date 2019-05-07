import Chance = require('chance')
import {
  contextMenuItems,
  createNewFileName,
  moveToFolderAndCheckIfFileExists,
  newMenuItems,
  openContextMenu,
  openNew,
  registerNewUser,
} from '../../support/documents'

context('The documents page', () => {
  let currentUser = { email: '', password: '' }

  const loginOrRegister = (user: { email: string; password: string }) => {
    cy.login(user.email, user.password).then(isSuccesful => {
      if (!isSuccesful) {
        currentUser = registerNewUser()
        cy.login(currentUser.email, currentUser.password)
      }
    })
  }

  before(async () => {
    if (process.env.CI) {
      currentUser = registerNewUser()
    }
  })

  beforeEach(() => {
    // Save current user locally to reduce user creation
    if (!process.env.CI) {
      cy.task('getCurrentUser', '../fixtures/currentUser.json')
        .then(user => (currentUser = user))
        .then(() => loginOrRegister(currentUser))
    } else {
      loginOrRegister(currentUser)
    }
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

  it('rename document should work', () => {
    const fileName = createNewFileName()
    const newName = createNewFileName()
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

  it('copy to context menu item should work', () => {
    const fileName = createNewFileName()
    cy.uploadWithApi({
      parentPath: `Root/Profiles/Public/${currentUser.email}/Document_Library`,
      fileName,
    })
    // const fileName = 'logo.png'
    const copyToPath = 'Sample folder'
    cy.contains(fileName).should('exist')
    openContextMenu(fileName)
    cy.get(`[title="${contextMenuItems.copyTo}"]`).click()
    // List picker component
    cy.contains('h6', 'Copy content').should('be.visible')
    cy.get('div[role="dialog"]')
      .contains('span', copyToPath)
      .click()
    cy.contains('button', 'Copy content here').click()
    // Copy to confirm dialog
    cy.contains('div[data-cy="copyTo"] h5', 'Copy content')
    cy.contains('div[data-cy="copyTo"] button', 'Copy content').click()
    cy.contains(`${fileName} is copied successfully`)
      .should('be.visible')
      .get('button[aria-label="Close"]')
      .click()
    // check successful copy
    cy.contains(fileName).should('exist')
    moveToFolderAndCheckIfFileExists(copyToPath, fileName)
  })
})
