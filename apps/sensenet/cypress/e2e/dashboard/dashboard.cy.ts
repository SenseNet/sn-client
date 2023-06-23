import { pathWithQueryParams } from '../../../src/services/query-string-builder'

const repoUrl = Cypress.env('repoUrl')

describe('Dashboard', () => {
  before(() => {
    cy.login()
    cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl } }))
  })
  it('Header should contains the url of the current repository.', () => {
    cy.get('[data-test="sensenet-header"]').contains(repoUrl)
  })

  it(`should have title`, () => {
    cy.get('[data-test="app-header"]').contains(/Welcome to/)
  })

  it('Subscription section should have the Business plan text and features list', () => {
    cy.get('[data-test="feature-users"]').should('exist')
    cy.get('[data-test="feature-content"]').should('exist')
    cy.get('[data-test="feature-storage-space"]').should('exist')
  })

  it('Current usage section should have correct usage info.', () => {
    cy.get('[data-test="usage-users"]').should('exist')
    cy.get('[data-test="usage-contents"]').should('exist')
    cy.get('[data-test="usage-storage-space"]').should('exist')
  })
})
