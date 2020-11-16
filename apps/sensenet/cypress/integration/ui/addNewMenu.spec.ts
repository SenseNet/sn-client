import { pathWithQueryParams } from '../../../src/services/query-string-builder'

describe('AddNew Menu', () => {
  before(() => {
    cy.login()
    cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
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
      'Demo Workspace',
    ]

    cy.get('[data-test="drawer-menu-item-content"]').click()
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2000)
    cy.get('[data-test="add-button"]')
      .click()
      .then(() => {
        cy.get('[data-test="list-items"]')
          .children()
          .should('have.length', dropdownItems.length)
          .each(($span) => {
            const text = $span.text()
            if (text) {
              expect(dropdownItems).to.include(text)
            }
          })
      })
  })

  it('should display an editor of new content and AddNew button should be disabled after selection', () => {
    cy.get('[data-test="listitem-folder"]').click()
    cy.get('span[data-test="viewtitle"]').should('have.text', 'New Folder')
    cy.get('[data-test="add-button"][disabled]').should('exist')
  })
})
