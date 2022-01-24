describe('The Shop FrontEnd Test', () => {
  it('reset MicroShop BE database', () => {
    cy.visit('http://localhost:3100/reset')
  })

  //move directly to adminstrative page
  it('visits the shop frontend', () => {
    cy.visit('http://localhost:4400/offer-tasks')
  })

  /*it('clicks on offer tasks buttom', () => {
    cy.get('#offer-tasks-button-home').click()
    cy.contains('Offers overview:')
  })*/

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
  })
})
