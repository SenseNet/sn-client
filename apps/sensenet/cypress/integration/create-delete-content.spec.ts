import { pathWithQueryParams } from '../../src/services/query-string-builder'

describe('Users menu', () => {
  beforeEach(() => {
    cy.login()
    cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))

    cy.get('[data-test="drawer-menu-item-Content"]')
    .click() //go to the Content section

    //select workspace
    cy.contains('IT Workspace').click()
    })

    it('Ensure creating a new folder works properly', () => {
        //create new folder
        cy.get('span[title="Add new"]').click()
        cy.get('ul[data-test="list-items"]').within(() => {
            cy.contains('Folder').click()
        })

        //Name and submit new folder
        cy.get('input[id="DisplayName"]').type('TestFolder')
        cy.get('input[id="Name"]').type('TestFolder')
        cy.get('button[aria-label="Submit"]').click()

        //Check if folder exists
        cy.get('div[aria-label="grid"]').within(() => {
            cy.contains('TestFolder').should('exist')
        })
    })

    it('Ensure folder delete works properly', () => {
        //Open right click menu and choose delete
        cy.get('div[aria-label="grid"]').within(() => {
            cy.contains('TestFolder').rightclick()
        })
        cy.get('ul[role="menu"]').within(() => {
            cy.contains('Delete').click()
        })

        //Tick permanently and confirm
        cy.get('div[class="MuiDialogActions-root MuiDialogActions-spacing"]').within(() => {
            cy.get('input[type="checkbox"]').click()
            cy.get('button[aria-label="Delete"]').click()
        })

        //Check if folder no longer exists
        cy.get('div[aria-label="grid"]').within(() => {
            cy.contains('TestFolder').should('not.exist')
        })
    })
})