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
        amount: 22,
      }
    })
    .then((response) => {
      const product = response.body;
      expect(product).have.property('product', 'black_socks')
      expect(product).have.property('amount', 10);
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
      expect(product).have.property('amount', 20);
    })
  })

  it('sends an add offer for black_socks', () => {
    cy.request('POST', 'http://localhost:3100/event', {
      eventType: 'addOffer',
      blockId: 'black_socks_price',
      time: '12:14',
      tags: [],
      payload: {
        product: 'black_socks',
        price: '$42',
      }
    }).then((response) => {
      const product = response.body;
      expect(product).have.property('product', 'black_socks')
      expect(product).have.property('amount', 20);
      expect(product).have.property('price', '$42');
    })
  })

  it('sends a placeOrder command', () => {
    cy.request('POST', 'http://localhost:3100/event', {
      eventType: 'placeOrder',
      blockId: 'o1121',
      time: '12:21',
      tags: [],
      payload: {
        code:'o1121',
        product: 'black_socks',
        customer: 'Carli Customer',
        address: 'Wonderland 1',
        state: 'new order',
      }
    }).then((response) => {
      const order = response.body;
      expect(order).have.property('product', 'black_socks');
      expect(order).have.property('customer', 'Carli Customer');
      expect(order).have.property('state', 'new order');
    })

    cy.request('GET', 'http://localhost:3100/query/customers')
    .then((response) => {
      const customerList: any[] = response.body;
      console.log('query customers resonse is \n' + JSON.stringify(customerList, null, 3));
      expect(customerList.length).gt(0);
    })
  })

  //Test second time
  it('Check dublicate requests: sends an add offer for black_socks', () => {
    cy.request('POST', 'http://localhost:3100/event', {
      eventType: 'addOffer',
      blockId: 'black_socks_price',
      time: '12:14',
      tags: [],
      payload: {
        product: 'black_socks',
        price: '$44',
      }
    }).then((response) => {
      const product = response.body;
      expect(product).have.property('product', 'black_socks')
      expect(product).have.property('amount', 20);
      expect(product).have.property('price', '$42');
    })
  })

  it('Check dublicate requests: sends a placeOrder command', () => {
    cy.request('POST', 'http://localhost:3100/event', {
      eventType: 'placeOrder',
      blockId: 'o1121',
      time: '12:21',
      tags: [],
      payload: {
        code:'o1121',
        product: 'black_socks',
        customer: 'Carli Customer',
        address: 'Wonderland 1',
        state: 'new order',
      }
    }).then((response) => {
      const order = response.body;
      expect(order).have.property('product', 'black_socks');
      expect(order).have.property('customer', 'Carli Customer');
      expect(order).have.property('state', 'new order');
    })

    cy.request('GET', 'http://localhost:3100/query/customers')
    .then((response) => {
      const customerList: any[] = response.body;
      console.log('query customers resonse is \n' + JSON.stringify(customerList, null, 3));
      expect(customerList.length).lt(2);
    })
  })

  //reverse order
  it('resets the shop database', () => {
    cy.visit('http://localhost:3100/reset')
  })

  it('Reverse order: sends an update 20 socks', () => {
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
      expect(product).have.property('amount', 20);
    })
  })

  it('posts a product stored event earlier', () => {
    cy.request('POST', 'http://localhost:3100/event', {
      eventType: 'productStored',
      blockId: 'black_socks',
      time: '12:04',
      tags: [],
      payload: {
        product: 'black_socks',
        amount: 22,
      }
    })
    .then((response) => {
      const product = response.body;
      expect(product).have.property('product', 'black_socks')
      expect(product).have.property('amount', 20);
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
      expect(product).have.property('amount', 20);
    })
  })

})
