import Chance = require('chance')
import { contextMenuItems, newMenuItems, openContextMenu } from '../../support/documents'

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
