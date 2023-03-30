import { pathWithQueryParams } from '../../../src/services/query-string-builder'

describe('Change Password', () => {
  beforeEach(() => {
    cy.login()
    cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
  })
  it('Should Change password', () => {
    cy.get('[data-test="user-menu-button"]').click()
    cy.get("[data-test='change-password-menu']").click()

    cy.intercept(/ChangePassword/).as('change-password')

    cy.get("[data-test='new-password']").type('businesscat')
    cy.get('[date-test="confirm-password"]').type('businesscat')

    cy.get('[data-test="change-password-submit"]').click()

    cy.wait('@change-password').then(({ response }) => {
      expect(response?.statusCode).to.eq(204)
    })
  })

  it('Should not change password if the new password is not the same as the confirm password', () => {
    cy.get('[data-test="user-menu-button"]').click()
    cy.get("[data-test='change-password-menu']").click()

    cy.intercept(/ChangePassword/).as('change-password')

    cy.get("[data-test='new-password']").type('businesscat')
    cy.get('[date-test="confirm-password"]').type('businesscat2')
    cy.get('[data-test="change-password-submit"]').click()

    cy.get('[data-test="change-password-submit"]').should('be.disabled')
  })
})
