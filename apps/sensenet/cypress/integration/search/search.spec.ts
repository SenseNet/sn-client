import { PATHS } from '../../../src/application-paths'
import { pathWithQueryParams } from '../../../src/services/query-string-builder'

describe('Search', () => {
  it.only('should search available', () => {
    cy.login()
    cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
      .get('[data-test="search-button"]')
      .click()
      .get('[data-test="command-box"] input')
      .should('be.visible')
  })

  context('suggestion list', () => {
    const term = 'busi'
    beforeEach(() => {
      cy.login()
      cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
        .get('[data-test="search-button"]')
        .click()
        .get('[data-test="command-box"] input')
        .type(term)
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
})
