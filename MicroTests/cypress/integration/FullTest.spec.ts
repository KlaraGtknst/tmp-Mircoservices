describe('The Shop FrontEnd Test', () => {
  it('reset MicroShop BE database', () => {
    cy.visit('http://localhost:3100/reset')
  })

  it('reset MicroWarehouse BE database', () => {
    cy.visit('http://localhost:3000/reset')
  })

  //1. visits warehouse FE, new products arrive at Warehouse
  it('visits warehouse FE, add jeans, tshirt and multiple locations', () => {
    cy.visit('http://localhost:4200/store-tasks/add-palette')
    cy.get('#barcodeInput').type('b_002')
    cy.get('#productInput').type('jeans')
    cy.get('#amountInput').type('12')
    cy.get('#locationInput').type('shelf 03')
    cy.get('#addPalette').click()

    cy.visit('http://localhost:4200/store-tasks/add-palette')
    cy.get('#barcodeInput').type('b_003')
    cy.get('#productInput').type('jeans')
    cy.get('#amountInput').type('15')
    cy.get('#locationInput').type('front row')
    cy.get('#addPalette').click()

    cy.visit('http://localhost:4200/store-tasks/add-palette')
    cy.get('#barcodeInput').type('b_004')
    cy.get('#productInput').type('tshirt')
    cy.get('#amountInput').type('15')
    cy.get('#locationInput').type('room 11')
    cy.get('#addPalette').click()
  })

  //Shop FE: adminstrative page
  it('sets price of tshirt to 9,99 and price of jeans to 42,99', () => {
    cy.visit('http://localhost:4400/offer-tasks')
    cy.get('#edit-offer-button').click()
    cy.contains('Edit offer:')
    cy.get('#name').type('tshirt')
    cy.get('#price').type('9.99')
    cy.get('#submitOfferButton').click()
    cy.contains('Offers overview:')

    cy.visit('http://localhost:4400/offer-tasks/edit-offer')
    cy.get('#name').type('jeans')
    cy.get('#price').type('42.99')
    cy.get('#submitOfferButton').click()

    cy.contains('Offers overview:')
  })

  it('validates the jeans price in the database', () => {
    cy.request('GET', 'http://localhost:3100/query/product-jeans')
    .then((response) => {
      const product: any = response.body;
      console.log('query jeans got \n' + JSON.stringify(product, null, 3));
      expect(product.price).equal('42.99');
    })

  })

  //Shop FE: customer page
  it('starts shopping', () => {
    cy.visit('http://localhost:4400')
  })

  //2. place order -> check status of order at customer page
  it('clicks on jeans', () => {
    cy.contains('jeans').click()
    cy.contains('Order details:')
    cy.get('#orderInput').clear().type('o_001')
    cy.get('#customerInput').type('Carli')
    cy.get('#addressInput').type('Wonderland 1')
    cy.get('#submitOrderButton').click()

    cy.contains('Hello Carli')
    cy.contains('jeans')
    cy.contains('state order placed')
  })

  //Warehouse FE
  it('visits warehouse FE', () => {
    cy.visit('http://localhost:4200')
  })

  //3. A worker in the warehouse prepares that order (click on Pick Tasks Button & picks jeans from shelf 03)
  //-> check status of order at pick Tasks page
  it('A worker in the warehouse prepares that order', () => {
    cy.get('#pick-tasks-button').click()
    cy.contains('Pick Tasks:')
    cy.contains('order placed')
    cy.contains('jeans').click()

    cy.get('#locationInput').type('shelf 03')
    cy.get('#doneButton').click()
    cy.contains('Pick Tasks:')
    cy.contains('picking')
  })

  //-> check status of order at customer page
  it('checks if cali is informed', () => {
    cy.visit('http://localhost:4400/home/Carli')
    cy.contains('Hello Carli, you have 1 active order(s)')
    cy.contains('picking')
  })

  //4.  A delivery person takes the prepared order
  //http://localhost:4200/deliver-orders
  it('A delivery person takes the prepared order', () => {
    cy.visit('http://localhost:4200/deliver-orders')
    //cy.get('#Carli, Wonderland 1jeansdeliver').click()
    cy.get('#deliver').click()

    //TODO: reload page and check if is empty
    cy.visit('http://localhost:4200/deliver-orders')

  })

  //-> check status of order at customer page
  it('checks if cali is informed about the shipping', () => {
    cy.visit('http://localhost:4400/home/Carli')
    cy.contains('Hello Carli, you have 1 active order(s)')
    cy.contains('shipping')
  })

  //-> check status of order at pick Tasks page
  it('checks if pickTasks page is informed about the shipping', () => {
    cy.visit('http://localhost:4200/pick-tasks')
    cy.contains('Pick Tasks:')
    cy.contains('shipping')
  })

})
