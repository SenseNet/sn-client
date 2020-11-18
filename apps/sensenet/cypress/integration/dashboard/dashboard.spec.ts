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
    cy.get('[data-test="app-header"]').contains(/Welcome to your (.)+ project/)
  })

  it('Subscription section should have the Developer plan text and features list', () => {
    cy.get('[data-test="feature-users"]').contains(/[0-3] users/)
    cy.get('[data-test="feature-content"]').contains(/([0-9]|[1-8][0-9]|9[0-9]|[1-4][0-9]{2}|500) content/)
    cy.get('[data-test="feature-storage-space"]').contains(/[0-1] GB storage space/)
  })

  it('Current usage section should have correct usage info.', () => {
    cy.get('[data-test="usage-users"]').contains(/[0-3] of 3 used/)
    cy.get('[data-test="usage-contents"]').contains(/[0-9]|[1-8][0-9]|9[0-9]|[1-4][0-9]{2}|500 of 500 used/)
    cy.get('[data-test="usage-storage-space"]').contains(/0.[0-9]*|1 of 1 GB used/)
  })
})
