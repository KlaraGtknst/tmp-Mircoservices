/* eslint-disable prettier/prettier */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BuildEvent } from './build-event.schema';
import { MSProduct } from './product.schema';
import { Order } from './order.schema';
import { Customer } from './customer.schema';

@Injectable()
export class BuilderService implements OnModuleInit {

    constructor(
        @InjectModel('eventStore') private buildEventModel: Model<BuildEvent>,
        @InjectModel('products') private productsModel: Model<MSProduct>,
        @InjectModel('orders') private ordersModel: Model<Order>,
        @InjectModel('customers') private customersModel: Model<Customer>
      ) {}

    async onModuleInit() {
        await this.reset();
    }

    async clear() {
        await this.productsModel.deleteMany();
        await this.buildEventModel.deleteMany();
        await this.ordersModel.deleteMany();
        await this.customersModel.deleteMany();
    }

    async reset() {
        await this.clear();
        /*await this.handleProductStored( {
            blockId: 'rubber_boots',
            time: '11:00:00',
            eventType: 'ProductStored',
            tags: ['product', 'rubber_boots'],
            payload: {
                product: 'rubber_boots',
                amount: 23,
                location: 'entry_door',
            }
        });
        await this.handleProductStored( {
            blockId: 'rubber_boots',
            time: '11:00:00',
            eventType: 'ProductStored',
            tags: ['product', 'rubber_boots'],
            payload: {
                product: 'rubber_boots',
                amount: 23,
                location: 'entry_door',
            }
        });*/
    }

    async getByTag(tag: string) {
        console.log('getByTag called with ' + tag);
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
                //amount: event.payload.amount,
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
            console.log('BuilderService.storeProduct storeProduct: \n' + JSON.stringify(newProduct, null, 3));
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
            // console.log('builder service storeEvent line 56\n' + JSON.stringify(placeholder, null, 3));

            const newEvent = await this.buildEventModel.findOneAndUpdate(
                { blockId: event.blockId, time: {$lt: event.time}},
                {
                    tags: event.tags,
                    time: event.time,
                    eventType: event.eventType,
                    payload: event.payload,
                //event,
                },
                { new: true}
            ).exec();
            console.log('builder service storeEvent line 62\n' + JSON.stringify(newEvent, null, 3));

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
        const lastStoredEvent = await this.buildEventModel.findOne({blockId: productName}).exec();
        const lastEvent = lastStoredEvent.payload.amount;

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

}


