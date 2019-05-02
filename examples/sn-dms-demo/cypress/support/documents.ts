export const openContextMenu = (name: string | number | RegExp) =>
  cy
    .contains('tr', name, { timeout: 10000 })
    .should('be.visible')
    .click()
    .trigger('contextmenu')
