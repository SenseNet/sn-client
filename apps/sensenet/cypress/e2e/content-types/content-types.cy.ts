import { defaultContentType, defaultFieldSettings } from '../../../src/components/edit/default-content-type'
import { pathWithQueryParams } from '../../../src/services/query-string-builder'

const ctdExample = `<ContentType name="MyType" parentType="GenericContent" handler="SenseNet.ContentRepository.GenericContent" xmlns="http://schemas.sensenet.com/SenseNet/ContentRepository/ContentTypeDefinition">
<DisplayName>MyType</DisplayName>
<Description></Description>
<Icon>Content</Icon>
<AllowIncrementalNaming>true</AllowIncrementalNaming>
<Fields>
<Field name="ShortTextField" type="ShortText">
  <DisplayName>ShortTextFieldTest</DisplayName>
  <Description></Description>
  <Configuration>
    <MaxLength>100</MaxLength>
    <MinLength>0</MinLength>
    <ReadOnly>false</ReadOnly>
    <Compulsory>false</Compulsory>
    <DefaultValue>test</DefaultValue>
    <VisibleBrowse>Show</VisibleBrowse>
    <VisibleEdit>Show</VisibleEdit>
    <VisibleNew>Show</VisibleNew>
  </Configuration>
</Field>
</Fields>
</ContentType>`

describe('Content types', () => {
  before(() => {
    cy.login()
    cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
      .get('[data-test="drawer-menu-item-content-types"]')
      .click()

    cy.viewport(1340, 890)
  })

  context('create & delete', () => {
    it('should create a new content type', (done) => {
      cy.get('[data-test="add-button"]').should('not.be.disabled').click()
      cy.get('[data-test="list-items"]')
        .eq(0)
        .click()
        .then(() => {
          cy.get('.monaco-editor textarea')
            .click({ force: true })
            .focused()
            .type('{ctrl}a')
            .clear({ force: true })
            .invoke('val', ctdExample)
            .trigger('input')

          cy.contains('Submit').click()

          cy.get('.ReactVirtualized__Table__Grid').then((grid) => {
            cy.scrollToItem({
              container: grid,
              selector: '[data-test="table-cell-mytype"]',
              done: (element) => {
                expect(!!(element.offsetWidth || element.offsetHeight || element.getClientRects().length)).to.equal(
                  true,
                )
                done()
              },
            })
          })
        })
    })

    it('should delete a content type', () => {
      cy.get('.ReactVirtualized__Table__Grid').then((grid) => {
        cy.scrollToItem({
          container: grid,
          selector: '[data-test="table-cell-mytype"]',
        }).then(() => {
          cy.get(`[data-test="table-cell-mytype"]`).rightclick({ force: true })

          cy.get('[data-test="content-context-menu-delete"]').click()
          cy.get('[data-test="delete-permanently"] input[type="checkbox"]').check()
          cy.get('[data-test="button-delete-confirm"]').click()

          cy.get('[data-test="table-cell-mytype"]').should('not.exist')
        })
      })
    })
  })

  context('read', () => {
    before((done) => {
      cy.get('.ReactVirtualized__Table__Grid').then((grid) => {
        cy.scrollToItem({
          container: grid,
          selector: '[data-test="table-cell-article"]',
          done: () => {
            done()
          },
        })
      })
    })

    it('clicking on the content types menu item should show article', () => {
      cy.get('[data-test="table-cell-article"]').should('be.visible')
    })

    it('double clicking on article should open binary editor', () => {
      cy.get('[data-test="table-cell-article"]').dblclick({ force: true })

      cy.get('[data-test="editor-title"]').should('have.text', 'Article')
      cy.get('.monaco-editor').should('exist')

      cy.get('[data-test="monaco-editor-cancel"]').click()
    })
  })

  context('presets', () => {
    before(() => {
      cy.login()
      cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
        .get('[data-test="drawer-menu-item-content-types"]')
        .click()

      cy.viewport(1340, 890)
    })
    it('it should insert presets', () => {
      cy.get('[data-test="add-button"]').should('not.be.disabled').click()
      cy.get('[data-test="list-items"]')
        .eq(0)
        .click()
        .then(() => {
          defaultFieldSettings.forEach((field) => {
            cy.get(`[data-test="preset-button-${field.name}"]`)
              .should('exist')
              .click()
              .then(() => {
                cy.get('.monaco-editor .view-lines')
                  .then((editor) => {
                    const content = editor.text().replace(/[\s]+/g, '')
                    //field.value.replace "\n" to '' and every whitespace to ''
                    const fieldvalue = field.value.replace(/[\n\s]+/g, '')
                    expect(content).to.contain(fieldvalue)
                  })
                  .then(() => {
                    cy.get('.monaco-editor textarea').click({ force: true }).focused().type('{ctrl}z')
                  })
              })
          })
        })
    })
  })
})
