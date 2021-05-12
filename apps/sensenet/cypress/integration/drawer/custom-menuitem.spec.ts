import { PATHS, resolvePathParams } from '../../../src/application-paths'
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

    const items = ['Awesome demo', 'Cruel deadline', 'Long event', 'Overrated meeting', 'Remarkable event']

    cy.visit(
      pathWithQueryParams({
        path: resolvePathParams({ path: PATHS.settings.appPath, params: { submenu: 'adminui' } }),
        newParams: { repoUrl: Cypress.env('repoUrl') },
      }),
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
      url: 'odata.svc/Root/Content/IT/Calendar?*',
    }).as('getCalendar')

    cy.visit(
      pathWithQueryParams({
        path: resolvePathParams({ path: PATHS.settings.appPath, params: { submenu: 'adminui' } }),
        newParams: { repoUrl: Cypress.env('repoUrl') },
      }),
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
      pathWithQueryParams({
        path: resolvePathParams({ path: PATHS.settings.appPath, params: { submenu: 'adminui' } }),
        newParams: { repoUrl: Cypress.env('repoUrl') },
      }),
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
