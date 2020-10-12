import { pathWithQueryParams } from '../../../src/services/query-string-builder'

context('AddNew Menu', () => {
  before(() => cy.clearCookies({ domain: null } as any))

  beforeEach(() => {
    cy.login()
  })

  it('should open a dropdown with the list of allowed child types', () => {
    const dropdownItems = [
      'Folder',
      'Document Library',
      'Image Library',
      'Event List',
      'Memo List',
      'Link List',
      'Task list',
      'Custom List',
      'Workspace',
      'System Folder',
      'Demo Workspace',
      'Image'
    ]
    cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
      .get('a[href="/content/explorer/"]')
      .click()
      .get('button[data-test="add-button"]')
      .click()
      .get('[data-test="listitem"]')
      .each(($span) => {
        const text = $span.text()
        if (text) {
          expect(dropdownItems).to.include(text)
        }
      })
  })

  it('should display an editor of new content and AddNew button should be disabled after selection', () => {
    cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
      .get('a[href="/content/explorer/"]')
      .click()
      .get('button[data-test="add-button"]')
      .click()
      .get('[data-test="listitem"]')
      .first()
      .click()
      .get('span[data-test="viewtitle"]')
      .should('have.text', 'New Folder')

    cy.get('button[data-test="add-button"][disabled]').should('exist')
  })
})
