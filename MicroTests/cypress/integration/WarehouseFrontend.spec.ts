describe('Warehouse Test', () => {
  it('visits the warehouse frontend', () => {
    cy.visit('http://localhost:4200/')
  })

  it('clicks on store-tasks', () => {
    cy.get('#store-tasks-button').click()
    cy.contains('Warehouse Palettes:')
  })

  it('clicks on the add palette button', () => {
    cy.get('#add-button').click()
    cy.contains('Store new palette:')
  })

  it('Adds palette cy01', () => {
    cy.get('#barcodeInput').type('cy01')
    cy.get('#productInput').type('yellow scarf')
    cy.get('#amountInput').type('12')
    cy.get('#locationInput').type('front row, shelf 1')
    cy.get('#addPalette').click()

    cy.contains('Warehouse Palettes:')
    cy.get('#cy01').contains('12')
    cy.get('#cy01').contains('yellow scarf')
    cy.get('#cy01').contains('front row, shelf 1')
  })
})
