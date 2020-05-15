describe('Test site', () => {
  it('visit the main page of the base url', () => {
    cy.viewport(1602, 947)
    cy.visit('/')
    cy.xpath('/html/body/div[1]/div/div/div/div[1]/p[1]').contains('Welcome')
  })
})
