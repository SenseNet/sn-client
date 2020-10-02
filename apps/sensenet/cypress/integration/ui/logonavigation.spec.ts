import { pathWithQueryParams } from '../../../src/services/query-string-builder'

describe('Logo Navigation Test', () => {
  beforeEach(() => {
    cy.login('admin')
    cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
  })

  it('should go to Root on click of Logo', () => {
    cy.get('a[href="/content/explorer/"]').click()
    cy.get('[alt="logo"]')
      .click()
      .location()
      .should((loc) => {
        expect(loc.pathname).to.eq('/')
      })
  })
})
