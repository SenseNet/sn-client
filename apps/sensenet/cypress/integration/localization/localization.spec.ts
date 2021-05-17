import { pathWithQueryParams } from '../../../src/services/query-string-builder'

const exampleLocalization = `<?xml version="1.0" encoding="utf-8"?>
<?xml-stylesheet type="text/xsl" href="view.xslt"?>
<Resources>
  <ResourceClass name="Test">
    <Languages>
      <Language cultureName="en">
        <data name="Test" xml:space="preserve">
          <value>Test</value>
        </data>
      </Language>
      <Language cultureName="hu">
        <data name="Test" xml:space="preserve">
          <value>Teszt</value>
        </data>
      </Language>
    </Languages>
  </ResourceClass>
</Resources>`

describe('Localization', () => {
  beforeEach(() => {
    cy.login()
    cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
      .get('[data-test="drawer-menu-item-settings"]')
      .click()
    cy.get('[data-test="drawer-submenu-item-localization"]').click()
  })

  it('should contain a row with ActionResources.xml', () => {
    cy.get('.MuiTableCell-root div').contains('ActionResources.xml').should('have.text', 'ActionResources.xml')
  })

  it('should have the correct items in the right click menu', () => {
    cy.get('.MuiTableCell-root div').contains('ActionResources.xml').rightclick({ force: true })

    const expectedMenuItems = ['Details', 'Copy to', 'Edit', 'Move to', 'Check out', 'Download']

    cy.get('[role="presentation"] li')
      .should('have.length', expectedMenuItems.length)
      .each(($el) => {
        expect(expectedMenuItems).to.include($el.text())
      })

    cy.get('[role="presentation"] [aria-hidden="true" ]:first').click({ force: true })

    cy.get('[role="presentation"] li').should('not.exist')
  })

  it('should open a binary editor with the content of the item on double click', () => {
    cy.get('.MuiTableCell-root div').contains('ActionResources.xml').dblclick({ force: true })

    cy.get('[data-test="editor-title"]').should('have.text', 'ActionResources.xml')

    cy.get('button[aria-label="Cancel"]').click()

    cy.get('[data-test="editor-title"]').should('not.exist')
  })

  it('should create a new localization file', (done) => {
    cy.get('[data-test="add-button"]').should('not.be.disabled').click()
    cy.get('[data-test="listitem-resource"]')
      .click()
      .then(() => {
        cy.get('[data-test="editor-title"] input').type('testResource')

        cy.get('.monaco-editor textarea')
          .click({ force: true })
          .focused()
          .type('{ctrl}a')
          .clear()
          .invoke('val', exampleLocalization)
          .trigger('input')

        cy.contains('Submit').click()

        cy.get('.ReactVirtualized__Table__Grid').then((grid) => {
          cy.scrollToItem({
            container: grid,
            selector: '[data-test="table-cell-testresource.xml"]',
            done: (element) => {
              expect(!!(element.offsetWidth || element.offsetHeight || element.getClientRects().length)).to.equal(true)
              done()
            },
          })
        })
      })
  })

  it('should delete a localization file', () => {
    cy.get('.ReactVirtualized__Table__Grid').then((grid) => {
      cy.scrollToItem({
        container: grid,
        selector: '[data-test="table-cell-testresource.xml"]',
      }).then(() => {
        cy.get(`[data-test="table-cell-testresource.xml"]`).rightclick({ force: true })

        cy.get('[data-test="content-context-menu-delete"]').click()
        cy.get('[data-test="delete-permanently"] input[type="checkbox"]').check()
        cy.get('[data-test="button-delete-confirm"]').click()

        cy.get('[data-test="table-cell-testresource.xml"]').should('not.exist')
      })
    })
  })
})
