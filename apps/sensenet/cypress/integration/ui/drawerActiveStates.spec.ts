import { pathWithQueryParams } from '../../../src/services/query-string-builder'

describe('Drawer menu icons', () => {
  beforeEach(() => {
    cy.login()
    cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
  })

  it('clicking on the Search icon on the drawer should open the Search page', () => {
    cy.get('[aria-label="Search"]').as('searchIcon')
    cy.get('@searchIcon').should('not.have.class', 'Mui-selected')
    cy.get('@searchIcon').click()
    cy.get('@searchIcon').should('have.class', 'Mui-selected')
  })

  it('clicking on the content icon on the drawer should open the Content page', () => {
    cy.get('[aria-label="Content"]').as('contentIcon')
    cy.get('@contentIcon').should('not.have.class', 'Mui-selected')
    cy.get('@contentIcon').click()
    cy.get('@contentIcon').should('have.class', 'Mui-selected')
  })

  it('clicking on the Users and groups icon on the drawer should open the Users and groups page', () => {
    cy.get('[aria-label="Users and groups"]').as('UsersAndGroupsIcon')
    cy.get('@UsersAndGroupsIcon').should('not.have.class', 'Mui-selected')
    cy.get('@UsersAndGroupsIcon').click()
    cy.get('@UsersAndGroupsIcon').should('have.class', 'Mui-selected')
  })

  it('clicking on the Trash icon on the drawer should open the Trash page', () => {
    cy.get('[aria-label="Trash"]').as('trashIcon')
    cy.get('@trashIcon').should('not.have.class', 'Mui-selected')
    cy.get('@trashIcon').click()
    cy.get('@trashIcon').should('have.class', 'Mui-selected')
  })

  it('clicking on the Content Types icon on the drawer should open the Content Types page', () => {
    cy.get('[aria-label="Content Types"]').as('contentTypesIcon')
    cy.get('@contentTypesIcon').should('not.have.class', 'Mui-selected')
    cy.get('@contentTypesIcon').click()
    cy.get('@contentTypesIcon').should('have.class', 'Mui-selected')
  })

  it('clicking on the Localization icon on the drawer should open the Localization page', () => {
    cy.get('[aria-label="Localization"]').as('localizationIcon')
    cy.get('@localizationIcon').should('not.have.class', 'Mui-selected')
    cy.get('@localizationIcon').click()
    cy.get('@localizationIcon').should('have.class', 'Mui-selected')
  })

  it('clicking on the Setup icon on the drawer should open the Setup page', () => {
    cy.get('[aria-label="Setup"]').as('setupIcon')
    cy.get('@setupIcon').should('not.have.class', 'Mui-selected')
    cy.get('@setupIcon').click()
    cy.get('@setupIcon').should('have.class', 'Mui-selected')
  })
})
