context('The theme-switcher', () => {
  beforeEach(() => {
    cy.login('admin')
  })

  it('should be set to light by default', () => {
    // Expected: The theme-switcher's text is 'Dark theme' and the switcher is not 'checked'
    cy.get(`#menu-list-grow > .MuiSwitch-switchBase > input[type="checkbox"]`).should('not.be.checked')
    cy.get('body').should('have.css', 'background-color', '#FFFFFF')
  })

  it('should switch theme to dark on click', () => {
    // Simulate click on the theme-switcher
    // Expected: The theme-switcher's text is 'Light theme' and the switcher is 'checked'
    cy.get(`#menu-list-grow > .MuiSwitch-switchBase > input[type="checkbox"]`).check().should('be.checked')
    cy.get('body').should('have.css', 'background-color', '#000000')
  })
})
