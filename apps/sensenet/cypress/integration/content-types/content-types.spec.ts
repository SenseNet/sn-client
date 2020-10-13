import { pathWithQueryParams } from '../../../src/services/query-string-builder'

describe('Content types', () => {
  beforeEach(() => {
    cy.login()
    cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
      .get('div[aria-label="Content Types"]')
      .click()
    cy.get('.ReactVirtualized__Grid__innerScrollContainer')
    cy.get('.ReactVirtualized__Table__Grid').scrollTo('bottom')
    cy.xpath('//div[text()="Article"]').scrollIntoView({ duration: 500 }).as('articleRow')
  })

  it('clicking on the content types menu item should show article', () => {
    cy.get('@articleRow').should('be.visible')
  })

  it.skip('right clicking on article should open context menu', () => {
    cy.get('@articleRow').rightclick()

    const actions = ['Edit', 'Delete', 'Set permissions']

    cy.get('.MuiList-root li[role="menuitem"]')
      .children()
      .not('.MuiListItemIcon-root')
      .should('have.length', actions.length)
      .each((child, i) => {
        expect(child.text()).to.eq(actions[i])
      })

    cy.get('.MuiPopover-root').click()
  })

  it('double clicking on article should open binary editor', () => {
    cy.get('@articleRow').dblclick()
    cy.get('div').contains('Article').should('be.visible')
    cy.get('.monaco-editor').should('be.visible')
    cy.get('button[aria-label="Cancel"]').click()
  })
})
