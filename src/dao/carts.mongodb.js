import cartsModel from '../models/carts.js';

export default class Cart{
    create(products){
        return cartsModel.create(products);
    }

    getById(id,populate){
        if(populate) return cartsModel.findById(id).populate(populate);
        return cartsModel.findById(id);
    }

    aggregate(aggregation){
        return cartsModel.aggregate(aggregation);
    }

    update(filter,query){
        return cartsModel.updateOne(filter,query);
    }
}
