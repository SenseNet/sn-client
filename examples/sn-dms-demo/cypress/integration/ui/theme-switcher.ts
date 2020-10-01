context('The theme-switcher', () => {
  const adminUser = {
    username: 'e2eadmin',
    password: 'e2eadmin',
  }
  beforeEach(() => {
    cy.login(adminUser.username, adminUser.password)
  })

  it('should be set to light by default', () => {
    // Expected: The theme-switcher's text is 'Dark theme' and the switcher is not 'checked'
  })

  it('should switch theme to dark on click', () => {
    // Simulate click on the theme-switcher
    // Expected: The theme-switcher's text is 'Light theme' and the switcher is 'checked'
  })
})
