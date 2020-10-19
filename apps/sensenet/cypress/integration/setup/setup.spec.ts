import { pathWithQueryParams } from '../../../src/services/query-string-builder'

describe('Setup', () => {
  it('should open the context menu if a "settings item" is clicked with the right mouse button', () => {
    cy.login()
    cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
      .get('[data-test="Setup"]')
      .click()
      .get('.MuiCardContent-root')
      .first()
      .rightclick()
      .get('ul.MuiList-root.MuiMenu-list.MuiList-padding')
      .xpath('//div[text()="Browse"]')
      .xpath('//div[text()="Copy to"]')
      .xpath('//div[text()="Edit"]')
      .xpath('//div[text()="Move to"]')
      .xpath('//div[text()="Check out"]')
      .xpath('//div[text()="Download"]')
  })
})
