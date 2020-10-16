import { pathWithQueryParams } from '../../../src/services/query-string-builder'

describe('Content types', () => {
  beforeEach(() => {
    cy.login()
    cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
      .get('[data-test="Content Types"]')
      .click()
    cy.get('.ReactVirtualized__Table__Grid').scrollTo('bottom')
    cy.xpath('//div[text()="Article"]').scrollIntoView({ duration: 500 }).as('articleRow')
  })

  it('clicking on the content types menu item should show article', () => {
    cy.get('@articleRow').should('be.visible')
  })

  it('double clicking on article should open binary editor', () => {
    cy.get('@articleRow').dblclick()
    cy.get('div').contains('Article').should('be.visible')
    cy.get('.monaco-editor').should('be.visible')
    cy.get('[data-test="cancel"]').click()
  })
})
