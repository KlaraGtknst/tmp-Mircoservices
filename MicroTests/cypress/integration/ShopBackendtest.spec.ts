describe('The Shop Backend Test', () => {
  it('visits the shop backend', () => {
    cy.visit('http://localhost:3100/')
  })

  it('resets the shop database', () => {
    cy.visit('http://localhost:3100/reset')
  })

  it('posts a product stored event', () => {
    cy.request('POST', 'http://localhost:3100/event', {
      eventType: 'productStored',
      blockId: 'black_socks',
      time: '12:04',
      tags: [],
      payload: {
        product: 'black_socks',
        amount: 10,
      }
    })
    .then((response) => {
      const product = response.body;
      expect(product).have.property('product', 'black_socks')
      expect(product).have.property('amount', 10);
    })
  })

  it('repeats the post without a change', () => {
    cy.request('POST', 'http://localhost:3100/event', {
      eventType: 'productStored',
      blockId: 'black_socks',
      time: '12:04',
      tags: [],
      payload: {
        product: 'black_socks',
        amount: 10,
      }
    })
    .then((response) => {
      const product = response.body;
      expect(product).have.property('product', 'black_socks')
      expect(product).have.property('amount', 10);  //for version without dublicate check: 20);
      })
    })


  it('sends an update with another 20 socks', () => {
    cy.request('POST', 'http://localhost:3100/event', {
      eventType: 'productStored',
      blockId: 'black_socks',
      time: '12:05',
      tags: [],
      payload: {
        product: 'black_socks',
        amount: 20,
      }
    })
    .then((response) => {
      const product = response.body;
      expect(product).have.property('product', 'black_socks')
      expect(product).have.property('amount', 30);
    })
  })
})
