import productsModel from '../db/models/products.js';

export default class ProductsServices{
    static getAll(limit,page,sort,query){
        return productsModel.paginate(query?{query}:{},{limit:limit?limit:10,page:page?page:1,sort:sort?sort:0});
    }

    static getById(id){
        return productsModel.findOne({_id:id});
    }

    static create(product){
        return productsModel.create(product);
    }

    static update(id,fields){
        return productsModel.updateOne({_id:id},{$set:fields});
    }

    static delete(id){
        return productsModel.deleteOne({_id:id});
    }
}