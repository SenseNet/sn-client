import { PATHS, resolvePathParams } from '../../../src/application-paths'
import { pathWithQueryParams } from '../../../src/services/query-string-builder'

describe('Batch operations: ', () => {
  beforeEach(() => {
    cy.login()
    cy.visit(pathWithQueryParams({ path: '/', newParams: { repoUrl: Cypress.env('repoUrl') } }))
  })

  it('it should render a preview in reference picker if it is an image', () => {
    cy.visit(
      pathWithQueryParams({
        path: resolvePathParams({ path: PATHS.content.appPath, params: { browseType: 'explorer' } }),
        newParams: { repoUrl: Cypress.env('repoUrl'), path: '/SampleWorkspace/Blog' },
      }),
    )

    cy.get('[data-test="table-cell-6-ways-to-unlock-true-collaboration-with-a-headless-cms"]').rightclick({
      force: true,
    })
    cy.get('[data-test="content-context-menu-edit"]').click({ force: true })
    cy.get('[for="LeadImage"]').siblings('ul').find('li:last-of-type button').click()
    cy.get('[placeholder="Search"]').type('teamwork')
    cy.get(
      '.MuiDialogContent-root img[src="https://daily.test.sensenet.cloud/Root/Content/SampleWorkspace/Blog/Images/teamwork.gif"]',
    ).should('be.visible')
  })
})
