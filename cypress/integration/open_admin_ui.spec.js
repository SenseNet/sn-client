const userName = 'businesscat'
const password = 'businesscat'
const repository = 'https://dev.demo.sensenet.com'
const welcomeMessage = 'Welcome back, Business Cat'

describe('Test forms', () => {
  beforeEach(() => {
    cy.login(userName, password, repository)
  })

  afterEach(() => {
    cy.logout()
  })

  it('edit', () => {
    cy.contains(welcomeMessage)
  })
})
