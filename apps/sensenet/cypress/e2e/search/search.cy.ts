import { PATHS } from '../../../src/application-paths'
import { pathWithQueryParams } from '../../../src/services/query-string-builder'

describe('Search', () => {
  it('should search available', () => {
    cy.login()
    cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
      .get('[data-test="search-button"]')
      .click()
      .get('[data-test="command-box"] input')
      .should('be.visible')
  })

  context('suggestion list', () => {
    const term = 'busi'
    before(() => {
      cy.login()
      cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
    })
    beforeEach(() => {
      cy.get('[data-test="sensenet-logo"]').click()
      cy.get('[data-test="search-button"]')
        .click()
        .get('[data-test="command-box"] input')
        .type(term, { delay: 250 })
        .get('[data-test="search-suggestion-list"] ul')
        .children()
        .as('search')
    })

    it('should have 6 suggestion items', () => {
      cy.get('@search').should('have.length', 6)
    })

    it('first item should be a link to the result page', () => {
      cy.get('@search')
        .first()
        .click()
        .location()
        .should((loc) => {
          expect(loc.pathname).to.eq(PATHS.search.appPath)
          expect(loc.search).to.eq(`?term=${term}`)
        })
    })

    it('first item should contain the search term', () => {
      cy.get('@search').first().contains(term)
    })

    it('second item is the Business Cat user', () => {
      cy.get('@search').eq(1).contains('Business Cat')
    })

    it('second item should navigate to edit', () => {
      cy.get('@search')
        .eq(1)
        .click()
        .location()
        .should((loc) => {
          expect(loc.pathname).to.contain('edit')
        })
    })

    it('second item should edit Business Cat', () => {
      cy.get('@search')
        .eq(1)
        .click()
        .get('#FullName')
        .invoke('val')
        .then((fullname) => expect(fullname).to.eq('Business Cat'))
    })
  })

  context('more contentTypes filter', () => {
    const term = 'admin*'
    before(() => {
      cy.login()
      cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
    })
    beforeEach(() => {
      cy.get('[data-test="sensenet-logo"]').click()
      cy.get('[data-test="search-button"]')
        .click()
        .get('[data-test="command-box"] input')
        .type(term, { delay: 250 })
        .get('[data-test="search-suggestion-list"] ul')
        .children()
        .as('search')
        .first()
        .click()
        .location()
        .should((loc) => {
          expect(loc.pathname).to.eq(PATHS.search.appPath)
          expect(loc.search).to.eq(`?term=${term}`)
        })
    })

    it('result contains users and groups', () => {
      cy.get('[data-test="table-cell-admin"]').should('exist')
      cy.get('[data-test="table-cell-administrators"]').should('exist')
      cy.get('[data-test="table-cell-captain-picard"]').should('not.exist')
    })

    it('the "more" menu contains more than 20 items including "group" and "user"', () => {
      cy.get('[data-test="more-type-filter-button"]').click()
      cy.get('[id="more-type-filter"]').contains('li', 'User')
      cy.get('[id="more-type-filter"]').contains('li', 'Group')
      cy.get('[data-test="more-menu-item-user"]').parent().children().its('length').should('be.gt', 20)
      // press <ESC> to hide the menu to unblock the UI
      cy.get('body').trigger('keydown', { keyCode: 27 })
    })

    it('result contains one user after  use the filter', () => {
      cy.get('[data-test="more-type-filter-button"]').click().get('[data-test="more-menu-item-user"]').click()
      // "MORE" changed to "USER"
      cy.get('[data-test="more-type-filter-button"]').contains('User')
      // "Administrators" disappeared
      cy.get('[data-test="table-cell-administrators"]').should('not.exist')
    })
  })
})
