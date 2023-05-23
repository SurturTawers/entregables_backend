import {cartRepository,ticketRepository} from '../repositories/index.js';

export default class CartsServices{
    static create(){
        return cartRepository.create([]);
    }

    static getById(id, populate){
        return cartRepository.getById(id,populate); 
    }

    static aggregate(aggregation){
        return cartRepository.aggregate(aggregation);
    }

    static update(filter, query){
        return cartRepository.update(filter,query);
    }

    static purchase(purchaseInfo){
        return ticketRepository.create(purchaseInfo);
    }
}