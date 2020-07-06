import { pathWithQueryParams } from '../../../src/services/query-string-builder'

describe('User handling', () => {
  before(() => cy.clearCookies({ domain: null } as any))

  it('should login with test user', () => {
    cy.visit('/')
    cy.get('input[name="repository"]').type(`${Cypress.env('repoUrl')}{enter}`)

    cy.get('#demoButton').click()
  })

  it('should logout', () => {
    cy.login()
    cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
      .get('.MuiToolbar-root .MuiAvatar-root+.MuiButtonBase-root.MuiIconButton-root')
      .click()
      .get('.MuiList-root li[role="menuitem"]')
      .contains('Log out')
      .click()

    cy.get('.MuiDialog-container .MuiDialogActions-root .MuiButton-containedPrimary').click()
  })
})
