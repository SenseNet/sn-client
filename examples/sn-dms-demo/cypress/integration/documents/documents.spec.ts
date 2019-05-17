import Chance = require('chance')
import {
  contextMenuItems,
  createNewFileName,
  moveToFolderAndCheckIfFileExists,
  newMenuItems,
  openContextMenu,
  openContextMenuItem,
  openNew,
  registerNewUser,
  selectPathInListPicker,
  uploadNewFileAndOpenContextMenuItem,
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
    uploadNewFileAndOpenContextMenuItem(currentUser.email, fileName, contextMenuItems.rename)
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
    const copyToPath = 'Sample folder'
    uploadNewFileAndOpenContextMenuItem(currentUser.email, fileName, contextMenuItems.copyTo)
    // List picker component
    selectPathInListPicker({ path: copyToPath, action: 'Copy' })
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

  it('move to context menu item should work', () => {
    const fileName = createNewFileName()
    const moveToPath = 'Sample folder'
    uploadNewFileAndOpenContextMenuItem(currentUser.email, fileName, contextMenuItems.moveTo)
    // List picker component
    selectPathInListPicker({ path: moveToPath, action: 'Move' })
    // Move to confirm dialog
    cy.contains('div[data-cy="moveTo"] h5', 'Move content')
    cy.contains('div[data-cy="moveTo"] button', 'Move content').click()
    cy.contains(`${fileName} is moved successfully`)
      .should('be.visible')
      .get('button[aria-label="Close"]')
      .click()
    // check successful copy
    cy.contains(fileName).should('not.exist')
    moveToFolderAndCheckIfFileExists(moveToPath, fileName)
  })

  it('edit properties should work', () => {
    const fileName = createNewFileName()
    uploadNewFileAndOpenContextMenuItem(currentUser.email, fileName, contextMenuItems.editProperties)
    cy.contains('div[data-cy="editProperties"]', 'Edit properties')
    const properties = {
      keywords: { value: 'keyword', selector: 'div[data-cy="editProperties"] .ql-editor' },
      index: { value: '1', selector: '#Index' },
      displayName: { value: Chance().word(), selector: '#DisplayName' },
      watermark: { value: Chance().word(), selector: '#Watermark' },
    }
    Object.keys(properties).forEach(key =>
      cy
        .get(properties[key].selector)
        .clear()
        .type(properties[key].value.toString()),
    )
    cy.contains('div[data-cy="editProperties"] button', 'Submit').click()
    cy.contains(`The content '${fileName}' has been modified`)
    openContextMenuItem(properties.displayName.value + '.png', contextMenuItems.editProperties)
    Object.keys(properties).forEach(key => {
      cy.get(properties[key].selector).should(key === 'keywords' ? 'have.text' : 'have.value', properties[key].value)
    })
  })

  it('check out and undo should work', () => {
    const fileName = createNewFileName()
    uploadNewFileAndOpenContextMenuItem(currentUser.email, fileName, contextMenuItems.checkOut)
    cy.contains(`${fileName} is successfully checked-out`).should('exist')
    cy.get('div[title="Checked out by: Me"]').should('exist')
    openContextMenuItem(fileName, contextMenuItems.editProperties)
    cy.get('#Watermark')
      .clear()
      .type('sometext')
    cy.contains('div[data-cy="editProperties"] button', 'Submit').click()
    openContextMenuItem(fileName, contextMenuItems.undoChanges)
    cy.contains(`${fileName} is reverted to the status before checking out`)
    openContextMenuItem(fileName, contextMenuItems.editProperties)
    cy.get('#Watermark').should('not.have.value', 'sometext')
  })
})
