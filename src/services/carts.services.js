import cartsModel from '../db/models/carts.js';

export default class CartsServices{
    static create(){
        return cartsModel.create({products:[]});
    }
    static getById(id, populate){
        if(populate){
            return cartsModel.findOne({_id:id}).populate(populate); 
        }
        return cartsModel.findOne({_id:id});
    }
    
    static aggregate(aggregation){
        return cartsModel.aggregate(aggregation);
    }

    static update(filter, query){
        return cartsModel.updateOne(filter,query);
    }
}