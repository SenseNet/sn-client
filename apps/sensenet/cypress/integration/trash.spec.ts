import { pathWithQueryParams } from '../../src/services/query-string-builder'

describe('Trash', () => {
    beforeEach(() => {
      cy.login()
      cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
  
      })

      it('Ensure that deleting a content moves the item to the trash', () => {

        cy.get('[data-test="drawer-menu-item-Content"]')
        .click() //go to the Content section
        //select workspace
        cy.contains('IT Workspace').click()
        cy.contains('Document library').click()

        //Add a new Folder
        cy.get('span[title="Add new"]').click()
        cy.get('ul[data-test="list-items"]').within(() => {
            cy.contains('Folder').click()
        })

        //Name and submit new folder
        cy.get('input[id="DisplayName"]').type('test')
        cy.get('input[id="Name"]').type('test')
        cy.get('button[aria-label="Submit"]').click()

        //Right click and delete Folder
        cy.get('div[aria-label="grid"]').within(() => {
          cy.contains('test').rightclick()
        })
        cy.get('ul[role="menu"]').within(() => {
          cy.contains('Delete').click()
        })

        //Confirm deletion
        cy.get('div[class="MuiDialogActions-root MuiDialogActions-spacing"]').within(() => {
          cy.get('button[aria-label="Delete"]').click()
        })

        //Enter trash and check if folder exists there
        cy.get('[data-test="drawer-menu-item-Trash"]').click()
        cy.get('div[class="ReactVirtualized__Grid ReactVirtualized__List"]').within(() => {
          cy.contains('test').should('exist')
        })
      })

      it('Ensure that restore of a content from trash works properly', () => { 
        //Enter trash and right click deleted folder
        cy.get('[data-test="drawer-menu-item-Trash"]').click()
        cy.get('div[class="ReactVirtualized__Grid ReactVirtualized__List"]').within(() => {
          cy.contains('test').rightclick()
        })
        cy.get('ul[role="menu"]').within(() => {
          cy.contains('Restore').click()
        })

        //Confirm restore
        cy.get('div[class="MuiDialogActions-root MuiDialogActions-spacing"]').within(() => {
          cy.get('button[aria-label="Restore"]').click()
        })

        //Check if folder was removed from trash
        cy.contains('test').should('not.exist')

        //Enter Content menu and check for restored folder
        cy.get('[data-test="drawer-menu-item-Content"]').click()
        cy.contains('IT Workspace').click()
        cy.contains('Document library').click()
        cy.get('div[aria-label="grid"]').within(() => {
          cy.contains('test').should('exist')
        })
      })

      it('Ensure that premanently deleted content does not move to trash', () => {
        cy.get('[data-test="drawer-menu-item-Content"]')
        .click() //go to the Content section
        //select workspace
        cy.contains('IT Workspace').click()
        cy.contains('Document library').click()

        //Right click folder and delete it
        cy.get('div[aria-label="grid"]').within(() => {
          cy.contains('test').rightclick()
        })
        cy.get('ul[role="menu"]').within(() => {
          cy.contains('Delete').click()
        })

        //Tick permanently and confirm
        cy.get('div[class="MuiDialogActions-root MuiDialogActions-spacing"]').within(() => {
          cy.get('input[type="checkbox"]').click()
          cy.get('button[aria-label="Delete"]').click()
        })
        
        //Enter trash and check if folder was fully removed
        cy.get('[data-test="drawer-menu-item-Trash"]').click()
        cy.contains('test').should('not.exist')
      })
})