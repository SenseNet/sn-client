export const openContextMenu = (name: string | number | RegExp) => {
  cy.contains('[data-cy=appbar]', 'Document library', { timeout: 10000 })
    .should('exist')
    .get('[data-cy=gridPlaceholder]')
    .should('be.hidden')
  cy.contains('tr', name)
    .click()
    .trigger('contextmenu')
}
