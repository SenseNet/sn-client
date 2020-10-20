import { pathWithQueryParams } from '../../../src/services/query-string-builder'

describe('Setup', () => {

  it('should open the context menu if a "settings item" is clicked with the right mouse button', () => {
    cy.login()
    cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
      .get('[data-test="Setup"]')
      .click()
      .get('.MuiCardContent-root')
      .first()
      .rightclick()
      .get('ul.MuiList-root.MuiMenu-list.MuiList-padding').within(()=>{
        cy.xpath('//div[text()="Browse"]')
        cy.xpath('//div[text()="Copy to"]')
        cy.xpath('//div[text()="Edit"]')
        cy.xpath('//div[text()="Move to"]')
        cy.xpath('//div[text()="Check out"]')
        cy.xpath('//div[text()="Download"]')
      })
      .get('.MuiPopover-root')
      .click()
  })

  it('should open a binary editor with the content of the "settings item" if Edit button is clicked', () => {
    cy.login()
    cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
      .get('[data-test="Setup"]')
      .click()
      .get('.MuiPaper-root.MuiCard-root')
      .first().within(()=>{
        cy.get('[type="Button"]')
        .first()
        .click()
      })
      .get('[data-test="editor-title"]').should('have.text',"DocumentPreview.settings")
  })

  it('should open the document of the selected "settings item" if "Learn more" button is clicked', () => {
    cy.login()
    cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
      .get('[data-test="Setup"]')
      .click()
      .get('.MuiPaper-root.MuiCard-root')
      .first().within(()=>{
        cy.get('[type="Button"]')
        .eq(1)
        .get('a[href="https://docs.sensenet.com/concepts/basics/07-settings#documentpreview-settings"]').should('have.attr', 'target', '_blank')
      })
  })

})
