import cartsModel from '../db/models/carts.js';

export default class CartsServices{
    static async create(){
        return await cartsModel.create({products:[]});
    }
    static async getById(id, populate){
        if(populate){
            return await cartsModel.findOne({_id:id}).populate(populate); 
        }
        return await cartsModel.findOne({_id:id});
    }
    
    static async aggregate(aggregation){
        return cartsModel.aggregate(aggregation);
    }

    static async update(filter, query){
        return await cartsModel.updateOne(filter,query);
    }
}