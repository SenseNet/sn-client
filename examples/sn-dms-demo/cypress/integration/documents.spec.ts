import Chance = require('chance')

context('The documents page', () => {
  /**
   * Change this to registered user once the test run for the first time to prevent new registration.
   * @example ```js
   * { email: 'miwor@sensenet.com', password: 'aY]w9UJ2j' }```
   */
  let currentUser = { email: '', password: '' }
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

  it('creates new document', () => {
    openNew('document')
    const displayName = Chance().word()
    cy.get('#DisplayName').type(displayName)
    cy.get('#Watermark').type(Chance().word() + '{enter}')
    cy.contains(displayName + '.docx is successfully created').should('exist')
    cy.contains(displayName + '.docx').should('exist')
  })
})

const openNew = (action: string) => {
  cy.visit('#/documents')
  cy.contains('Document library').should('exist')
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
