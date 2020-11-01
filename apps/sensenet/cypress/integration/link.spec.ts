import { pathWithQueryParams } from '../../src/services/query-string-builder'

describe('Users menu', () => {
  beforeEach(() => {
    cy.login()
    cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))

    cy.get('[data-test="drawer-menu-item-Content"]')
    .click() //go to the Content section

    //select workspace
    cy.contains('IT Workspace').click()
    cy.get('div[class="ReactVirtualized__Grid ReactVirtualized__List"]').within(() => {
        cy.contains('Links').click() //select link section
        })
    })

    it('Ensure that link creation work properly', () => {
        //create a new link
        cy.get('span[title="Add new"]').click()
        cy.get('ul[data-test="list-items"]').within(() => {
            cy.contains('Link').click()
        })

        //Submit name and url
        cy.get('input[id="DisplayName"]').type('Test Link')
        cy.get('input[id="Url"]').type('www.test.com')
        cy.get('button[aria-label="Submit"]').click()

        //Check if link exists
        cy.get('div[class="ReactVirtualized__Grid ReactVirtualized__Table__Grid"]').within(() => {
            cy.contains('Test Link').should('exist')
        })
    })

    it('Ensure that modifying a link works properly', () => {
        //Select link and choose edit
        cy.get('div[class="ReactVirtualized__Grid ReactVirtualized__Table__Grid"]').within(() => {
            cy.contains('Test Link').rightclick()
        })
        cy.get('ul[class="MuiList-root MuiMenu-list MuiList-padding"]').within(() => {
            cy.contains('Edit').click()
        })

        //Change link name
        cy.get('input[id="DisplayName"]').clear().type('Changed Test_Link')
        cy.get('button[aria-label="Submit"]').click()

        //Check if link name got correctly changed
        cy.get('div[class="ReactVirtualized__Grid ReactVirtualized__Table__Grid"]').within(() => {
            cy.contains('Changed Test_Link').should('exist')
            cy.contains('Test Link').should('not.exist')
        })
    })

    it('Ensure that delete a link content works properly', () => {
        //Select link and choose delete
        cy.get('div[class="ReactVirtualized__Grid ReactVirtualized__Table__Grid"]').within(() => {
            cy.contains('Changed Test_Link').rightclick()
        })
        cy.get('ul[class="MuiList-root MuiMenu-list MuiList-padding"]').within(() => {
            cy.contains('Delete').click()
        })

        //Tick permanently and confirm
        cy.get('div[class="MuiDialogActions-root MuiDialogActions-spacing"]').within(() => {
            cy.get('input[type="checkbox"]').click()
            cy.get('button[aria-label="Delete"]').click()
        })

        //Check if link no longer exists
        cy.get('div[class="ReactVirtualized__Grid ReactVirtualized__Table__Grid"]').within(() => {
            cy.contains('Changed Test_Link').should('not.exist')
        })
    })
})