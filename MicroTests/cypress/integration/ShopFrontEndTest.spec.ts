describe('The Shop FrontEnd Test', () => {
  it('reset MicroShop BE database', () => {
    cy.visit('http://localhost:3100/reset')
  })

  it('reset MicroWarehouse BE database', () => {
    cy.visit('http://localhost:3000/reset')
  })

  //Klara start
  //visits warehouse FE
  it('visits warehouse FE, add jeans and multiple locations', () => {
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
  })

  //Klara end

  //move directly to adminstrative page
  it('visits the shop frontend', () => {
    cy.visit('http://localhost:4400/offer-tasks')
  })

  it('clicks on edit offer tasks buttom', () => {
    cy.get('#edit-offer-button').click()
    cy.contains('Edit offer:')
  })

  it('sets price of jeans to 42,99', () => {
    cy.get('#name').type('jeans')
    cy.get('#price').type('forty')
    cy.get('#submitOfferButton').click()

    cy.contains('Edit offer:')

    //cy.wait(4000)

    cy.get('#price').clear()
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

  it('sets price of tshirt to 9,99', () => {
    cy.visit('http://localhost:4400/offer-tasks')
    cy.get('#edit-offer-button').click()
    cy.contains('Edit offer:')
    cy.get('#name').type('tshirt')
    cy.get('#price').type('9.99')
    cy.get('#submitOfferButton').click()

    cy.contains('Offers overview:')
  })

  //move directly to customer page
  it('starts shopping', () => {
    cy.visit('http://localhost:4400')
  })

  //place order
  it('clicks on jeans', () => {
    cy.contains('jeans').click()
    cy.contains('Order details:')
    cy.get('#orderInput').clear().type('o_001')
    cy.get('#customerInput').type('Carli')
    cy.get('#addressInput').type('Wonderland 1')
    cy.get('#submitOrderButton').click()

    cy.contains('Hello Carli')
    //cy.contains('Your jeans are in state order placed')
    cy.contains('jeans')
    cy.contains('state order placed')
  })

  //visits warehouse FE
  it('visits warehouse FE', () => {
    cy.visit('http://localhost:4200')
  })

  //click on Pick Tasks Button
  it('click on Pick Tasks Button', () => {
    cy.get('#pick-tasks-button').click()
    cy.contains('Pick Tasks:')
    cy.contains('jeans').click()
  })

  it('picks jeans from shelf 03', () => {
    cy.get('#locationInput').type('shelf 03')
    cy.get('#doneButton').click()
    cy.contains('Pick Tasks:')
  })

   //click on Pick Tasks Button
   it('checks if cali is informed', () => {
    cy.visit('http://localhost:4400/home/Carli')
  })
})
