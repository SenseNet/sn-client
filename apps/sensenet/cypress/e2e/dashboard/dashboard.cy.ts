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
    cy.get('[data-test="feature-users"]').contains(/25 users/)
    cy.get('[data-test="feature-content"]').contains(/25,000 content/)
    cy.get('[data-test="feature-storage-space"]').contains(/25 GB storage space/)
  })

  it('Current usage section should have correct usage info.', () => {
    cy.get('[data-test="usage-users"]').contains(/(1?[0-9]|2[0-5]) of 25 used/)
    cy.get('[data-test="usage-contents"]').contains(
      /([0-9]{0,4}|1[0-9],[0-9]{3}|2[0-4],[0-9]{3}|25,000) of 25,000 used/,
    )
    cy.get('[data-test="usage-storage-space"]').contains(
      /[0-9](.[0-9])?|1[0-9](.[0-9])?|2[0-4](.[0-9])?|25 of 25 GB used/,
    )
  })
})
