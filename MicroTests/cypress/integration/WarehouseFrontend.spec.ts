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

  it('suscribes the shop as listener to the warehouse', () => {
    cy.request('POST', 'http://localhost:3000/subscribe', {
      subscriberUrl: 'http://localhost:3100/event',
      lastEventTime: '0'
    })
    .then((response) => {
      const eventList : any[] = response.body;
      console.log('subscribe at warehouse is \n' + JSON.stringify(eventList, null, 3)) ;
      expect(eventList.length).gt(0);
    })
  })

  it('Adds another palette of yellow scarfs', () => {
    cy.get('#add-button').click()
    cy.contains('Store new palette:')

    cy.get('#barcodeInput').type('cy02')
    cy.get('#productInput').type('yellow scarf')
    cy.get('#amountInput').type('24')
    cy.get('#locationInput').type('front row, shelf 2')
    cy.get('#addPalette').click()

    cy.contains('Warehouse Palettes:')
    cy.get('#cy02').contains('24')
    cy.get('#cy02').contains('yellow scarf')
    cy.get('#cy02').contains('front row, shelf 2')
  })


})
