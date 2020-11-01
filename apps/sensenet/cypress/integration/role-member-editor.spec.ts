import { pathWithQueryParams } from '../../src/services/query-string-builder'

describe('Role Member', () => {
  beforeEach(() => {
    cy.login()
    cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))

    cy.get('[data-test="drawer-menu-item-Users and groups"]')
    .click() //go to the User and Group Section
    cy.get('[aria-label="contained primary button group"]')
    .click() //Select Groups

    //Get the Button for the Administrators Group
    cy.get('.ReactVirtualized__Table .ReactVirtualized__Table__Grid .ReactVirtualized__Table__row').as('GroupRows')
    cy.get('@GroupRows').contains('Administrators').parent().parent().parent().parent().as('AdminRow')
    cy.get('@AdminRow').within(() => {
        cy.get('[class="MuiButtonBase-root MuiButton-root MuiButton-contained jss98 MuiButton-containedPrimary MuiButton-containedSizeSmall MuiButton-sizeSmall"]').as('AdminMemberButton')
        .click()
    })
  })

  it('Ensure that adding a new member to a group works properly', () => {
    //Enter search word and check Dropdown menu
    cy.get('input[placeholder="Members"]').type('deve')
    cy.get('ul[role="listbox"]').within(() => {
        cy.contains('loper Dog').as('DeveloperDogEntry').should('exist')
        cy.contains('/Root/IMS/Public/Developers').as('DevelopersPublicEntry').should('exist')
        cy.contains('/Root/IMS/BultIn/Portal/Developers').as('DevelopersBultInEntry').should('exist')
    })

    //Add Developer Dog and check Group Member list
    cy.get('@DeveloperDogEntry').click()
    cy.get('button[type="submit"]').click()
    cy.get('ul[class="MuiList-root MuiList-padding"]').within(() => {
      cy.contains('Developer Dog').should('exist')
      cy.contains('Business Cat').should('exist')
    })

    //Close search window and check Member count
    cy.get('button[class="MuiButtonBase-root MuiIconButton-root jss100"]').click()
    cy.get('@AdminMemberButton').within(() => {
      cy.contains('[class="MuiButton-label"]', '2 Members').should('exist')
    })
  })

  it('Ensure that remove a member from a group works properly', () => {
    //Remove Developer Dog from the Group
    cy.get('ul[class="MuiList-root MuiList-padding"]').within(() => {
      cy.contains('[class="MuiTypography-root MuiListItemText-primary MuiTypography-body1 MuiTypography-displayBlock"]', 'Developer Dog').parent().parent().parent().as('CloseButtonParent')
      cy.get('@CloseButtonParent').within(() => {
        cy.get('[aria-label="delete"]').click()
      })
    })

    //Check group size in the list and button
    cy.get('ul[class="MuiList-root MuiList-padding"]').children().should('have.length', 1)
    cy.get('button[class="MuiButtonBase-root MuiIconButton-root jss100"]').click()
    cy.get('@AdminMemberButton').within(() => {
      cy.contains('[class="MuiButton-label"]', '1 Members').should('exist')
    })
  })
})