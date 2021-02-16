import { PATHS } from '../../../src/application-paths'
import { pathWithQueryParams } from '../../../src/services/query-string-builder'

describe('Custom menu item', () => {
  beforeEach(() => {
    cy.login()
  })

  it('should create a new custom menu', () => {
    const settings = {
      theme: 'dark',
      default: {
        drawer: {
          items: [
            {
              itemType: 'CustomContent',
              settings: {
                icon: 'AddAlert',
                title: 'Test',
                appPath: 'test',
                root: '/Root/Content/IT/Calendar',
                columns: ['DisplayName'],
                description: 'List of tests',
              },
            },
          ],
        },
      },
    }

    const items = [
      'Code review',
      'Infrastructure meeting',
      'Kickoff meeting',
      'Refinement',
      'Release',
      'Retrospective meeting',
      'Sales and product',
      'Scrum meeting',
      'Tech Call with Thorwell Group',
      'Upgrade',
    ]

    cy.visit(
      pathWithQueryParams({ path: PATHS.personalSettings.appPath, newParams: { repoUrl: Cypress.env('repoUrl') } }),
    )

    cy.get('.monaco-editor textarea')
      .eq(1)
      .click()
      .focused()
      .type('{ctrl}a')
      .clear()
      .invoke('val', JSON.stringify(settings))
      .trigger('input')

    cy.contains('Submit').click()

    cy.get('[data-test="drawer-menu-item-test"]').click()

    items.forEach((item) =>
      cy.get(`[data-test="table-cell-${item.replace(/\s+/g, '-').toLowerCase()}"]`).should('exist'),
    )
  })

  it('should create a custom menu with given columns', () => {
    const settings = {
      theme: 'dark',
      default: {
        drawer: {
          items: [
            {
              itemType: 'CustomContent',
              settings: {
                icon: 'AddAlert',
                title: 'Test',
                appPath: 'test',
                root: '/Root/Content/IT/Calendar',
                columns: ['DisplayName', 'CreatedBy'],
                description: 'List of tests',
              },
            },
          ],
        },
      },
    }

    cy.intercept({
      method: 'GET',
      url: '/Root/Content/IT/Calendar',
    }).as('getCalendar')

    cy.visit(
      pathWithQueryParams({ path: PATHS.personalSettings.appPath, newParams: { repoUrl: Cypress.env('repoUrl') } }),
    )

    cy.get('.monaco-editor textarea')
      .eq(1)
      .click()
      .focused()
      .type('{ctrl}a')
      .clear()
      .invoke('val', JSON.stringify(settings))
      .trigger('input')

    cy.contains('Submit').click()

    cy.get('[data-test="drawer-menu-item-test"]').click()

    cy.saveLocalStorage()

    cy.wait('@getCalendar').then((_interception) => {
      settings.default.drawer.items[0].settings.columns.forEach((column) =>
        cy.get(`[data-test="table-header-${column.replace(/\s+/g, '-').toLowerCase()}"]`).should('exist'),
      )
    })
  })

  it('custom menu should disappear after removing from settings', () => {
    const settings = {
      theme: 'dark',
    }

    cy.restoreLocalStorage()

    cy.visit(
      pathWithQueryParams({ path: PATHS.personalSettings.appPath, newParams: { repoUrl: Cypress.env('repoUrl') } }),
    )

    cy.get('[data-test="drawer-menu-item-test"]').should('exist')

    cy.get('.monaco-editor textarea')
      .eq(1)
      .click()
      .focused()
      .type('{ctrl}a')
      .clear()
      .invoke('val', JSON.stringify(settings))
      .trigger('input')

    cy.contains('Submit').click()

    cy.get('[data-test="drawer-menu-item-test"]').should('not.exist')
  })
})