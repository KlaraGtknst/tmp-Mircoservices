/* eslint-disable prettier/prettier */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BuildEvent } from './build-event.schema';
import { MSProduct } from './product.schema';
import { Order } from './order.schema';
import { Customer } from './customer.schema';
import { SetPriceDto } from 'src/common/SetPriceDto';
import { HttpService } from '@nestjs/axios';
import Subscription from './subscription';
import { PlaceOrderDto } from 'src/common/PlaceOrderDto';

@Injectable()
export class BuilderService implements OnModuleInit {

    public subscriberUrls : any[] = [];

    constructor(
        @InjectModel('eventStore') private buildEventModel: Model<BuildEvent>,
        @InjectModel('products') private productsModel: Model<MSProduct>,
        @InjectModel('orders') private ordersModel: Model<Order>,
        @InjectModel('customers') private customersModel: Model<Customer>,
        private httpService: HttpService
      ) {}

    async onModuleInit() {
        //await this.reset();
    }

    async clear() {
        await this.productsModel.deleteMany();
        await this.buildEventModel.deleteMany();
        await this.ordersModel.deleteMany();
        await this.customersModel.deleteMany();

    }

    async reset() {
        await this.clear();
    }

    async getByTag(tag: string) {
        //console.log('getByTag called with ' + tag);
        const list = await this.productsModel.find({ tags: tag }).exec();
        return list;
    }

    async handleProductStored(event: BuildEvent) {

        let newProduct = null;

        // store a build event
        const storeSuccess = await this.storeEvent(event);

        if(storeSuccess) {
            // store a product object
            const newAmount = await this.computeNewProductAmount(event.payload.product);
            const productPatch = {
                product: event.blockId,
                amount: newAmount,
                amountTime: event.time,
            }
            newProduct = await this.storeProduct(productPatch)
        } else {
            newProduct = await this.productsModel.findOne({product: event.blockId});
        }

        return newProduct;
    }

    async storeProduct(newProductData: any) {
        try {
            const newProduct = await this.productsModel.findOneAndUpdate(
                {product: newProductData.product},
                newProductData,
                {upsert: true, new: true}).exec();
            //console.log('BuilderService.storeProduct storeProduct: \n' + JSON.stringify(newProduct, null, 3));
            return newProduct;
        } catch(error) {
            console.log('Error in BuilderService.storeProduct: \n' + JSON.stringify(error, null, 3));
        }
    }

    async storeEvent(event: BuildEvent) {
            const placeholder = await this.buildEventModel.findOneAndUpdate(
                { blockId: event.blockId},
                { blockId: event.blockId, $setOnInsert: {time: ''}},
                { upsert: true, new: true}
            ).exec();
            // console.log('builder service storeEvent line 83\n' + JSON.stringify(placeholder, null, 3));

            const newEvent = await this.buildEventModel.findOneAndUpdate(
                { blockId: event.blockId, time: {$lt: event.time}},
                {
                    tags: event.tags,
                    time: event.time,
                    eventType: event.eventType,
                    payload: event.payload,
                },
                { new: true}
            ).exec();
            //console.log('builder service storeEvent line 95\n' + JSON.stringify(newEvent, null, 3));

            return newEvent != null;
    }
        


    async handleAddOffer(event: BuildEvent) {
        let newProduct = null;
        const storeSuccess = await this.storeEvent(event);
 
        if(storeSuccess) {
            //store a product object 
            const productPatch = {
                product: event.payload.product,
                price: event.payload.price,
            }

            try {
                newProduct = await this.productsModel.findOneAndUpdate(
                    { product: productPatch.product},
                    productPatch,
                    { upsert: true, new: true}).exec();
                return newProduct;
            } catch (error) {
                console.log('Error in BuilderService.storeProduct \n' + JSON.stringify(error, null, 3))
            }
        } else {
            return await this.productsModel.findOne({product: event.payload.product});
        }
    }

    async handlePlaceOrder(event: BuildEvent) {
        let newOrder = null;
        const storeSuccess = await this.storeEvent(event);
 
        if(storeSuccess) {
            //store a product object 

            try {
                //upsert order
                newOrder = await this.ordersModel.findOneAndUpdate(
                    { code: event.payload.code},
                    event.payload,
                    { upsert: true, new: true}).exec()
                
                //upsert customer
                await this.customersModel.findOneAndUpdate(
                    {name: event.payload.customer},
                    {
                        name: event.payload.customer,
                        lastAddress: event.payload.address,
                    },
                    {upsert: true, new: true}
                ).exec()

                return newOrder
            } catch (error) {
                console.log('Error in BuilderService.handlePlaceOrder \n' + JSON.stringify(error, null, 3))
            }
        } else {
            return await this.ordersModel.findOne({code: event.payload.code});
        }
    }

    async getCustomers() {
        return await this.customersModel.find({}).exec();
    }

    async computeNewProductAmount(productName) {
        //last productStored amount
        const lastStoredEvent = await this.buildEventModel.findOne({blockId: productName}).exec();
        const lastEvent = lastStoredEvent.payload.amount;

        //minus new orders
        const newOrdersList: any[] = await this.buildEventModel.find(
            {
                eventType: 'placeOrder',
                'payload.product': productName
            }
        ).exec();

        const newOrdersNumber = newOrdersList.length;

        const laterShippingList: any[] = await this.buildEventModel.find(
            {
                eventType: 'orderPicked',
                time: {$gt: lastStoredEvent.time},
                'payload.product': productName
            }
        ).exec();
        return lastEvent;
    }

    async getProducts() {
        return await this.productsModel.find({}).exec();
    }

    async getProduct(name) {
        return await this.productsModel.findOne({product: name}).exec();
    }

    async setPrice(params: SetPriceDto) {
        return await this.productsModel.findOneAndUpdate(
            {product: params.product},
            {price: `${params.price}`},
            {new: true}
        ).exec()
    }

    async placeOrder(params: PlaceOrderDto) {
        const result = await this.ordersModel.findOneAndUpdate(
            {code: params.order},
            {
                code: params.order,
                product: params.product,
                customer: params.customer,
                address: params.address,
                state: 'order placed',
            },
            {upsert: true, new: true}).exec()

        //console.log(`placeOrder stored: \n ${JSON.stringify(params.product, null, 3)}`)

        await this.customersModel.findOneAndUpdate(
            {name: params.customer},
            {
                name: params.customer,
                lastAddress: params.address,
            },
            {upsert: true, new: true}
        ).exec()

        const event = {
            blockId: params.order,
            time: new Date().toISOString(),
            eventType: 'productOrdered',
            tags: ['products', params.order],
            payload: params,
        };

        const updatedOrder = await this.productsModel.findOneAndUpdate(
            {product: params.product},
            {$inc:{amount: -1}},
            {new: true}
        ).exec()

        //console.log(`placeOrder stored order update: \n ${JSON.stringify(updatedOrder, null, 3)}`)
        

        await this.storeEvent(event);
        this.publish(event);
    }
    

    publish(newEvent: BuildEvent) {
        const oldUrls = this.subscriberUrls;
        this.subscriberUrls = []
        for (const url of oldUrls) {
            this.httpService.post(url, newEvent).subscribe(
                (response) => {
                    //console.log(response)
                    this.subscriberUrls.push(url)
                },
                (error) => {
                    console.log('Error in publish: \n' + JSON.stringify(error, null, 3));
                }
            );
        }
    }

    async handleSubscription(subscription: Subscription) {
        if (!this.subscriberUrls.includes(subscription.subscriberUrl)) {
          this.subscriberUrls.push(subscription.subscriberUrl);
        }
    
        const eventList = await this.buildEventModel
          .find({
            eventType: 'productOrdered',
            time: { $gt: subscription.lastEventTime },
          })
          .exec();
        return eventList;
      }
      
      async getOrdersOf(customer) {
        return await this.ordersModel.find({customer: customer}).exec();
    }

    async handleOrderPicked(event: BuildEvent) {

        const params = event.payload;
        const order = await this.ordersModel.findOneAndUpdate(
            {code: params.code},
            {
                state: params.state
            },
            {new: true}
        ).exec();

        const newEvent = {
            blockId: order.code,
            time: new Date().toISOString(),
            eventType: 'orderPicked',
            tags: ['orders', order.code],
            payload: {
                code: order.code,
                product: order.product,
                address: order.customer + ', ' + order.address,
                state: order.state
            }
        }
        await this.storeEvent(newEvent);
        
        return newEvent;
    }

    async handleOrderPickedOrdersModel(givenProduct: string) {
        await this.ordersModel.findOneAndUpdate(
            {product: givenProduct},
            {
                state: "picking"
            },
            {new: true}
        ).exec();
    }

    async handleOrderDelivered(event: BuildEvent) {

        const params = event.payload;
        const order = await this.ordersModel.findOneAndUpdate(
            {code: params.code},
            {
                state: params.state
            },
            {new: true}
        ).exec();

        const newEvent = {
            blockId: order.code,
            time: new Date().toISOString(),
            eventType: 'orderDelivered',
            tags: ['orders', order.code],
            payload: {
                code: order.code,
                product: order.product,
                address: order.customer + ', ' + order.address,
                state: order.state
            }
        }
        await this.storeEvent(newEvent);
        
        return newEvent;
    }

}


