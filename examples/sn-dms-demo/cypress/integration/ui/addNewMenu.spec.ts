import { pathWithQueryParams } from '../../../../../apps/sensenet/src/services/query-string-builder'

context('AddNew Menu', () => {
  before(() => cy.clearCookies({ domain: null } as any))

  beforeEach(() => {
    cy.login('e2e.admin@sensenet.com', 'e2eadmin')
  })

  it('should open a dropdown with the list of allowed child types', () => {
    const dropdownItems = [
      'Folder',
      'Document Library',
      'Image Library',
      'Event List',
      'Memo List',
      'Link List',
      'Task List',
      'Custom List',
      'Workspace',
      'System Folder',
      'Demo Workspace',
    ]
    cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
      .get('a.Content')
      .click()
      .get('span[title="Add new"]')
      .click()
      .get('ul.MuiList-root > div.MuiListItem-root > span.MuiListItemText-primary')
      .each(($span, index, $list) => {
        const text = $span.text()
        expect(dropdownItems).to.include(text)
      })
  })

  it('should display an editor of new content and AddNew button should be disabled after selection', () => {
    cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
      .get('a.Content')
      .click()
      .get('span[title="Add new"]')
      .click()
      .get('ul.MuiList-root > div.MuiListItem-root > span.MuiListItemText-primary')
      .first()
      .click()
      .get('#root > div > div > div > div > div > div > span')
      .should('have.text', 'New Folder')

    cy.get('div.MuiListItem-button > button[disabled]').should('exist')
  })
})
