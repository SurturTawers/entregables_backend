import productsModel from '../db/models/products.js';

export default class ProductsServices{
    static async getAll(limit,page,sort,query){
        return await productsModel.paginate(query?{query}:{},{limit:limit?limit:10,page:page?page:1,sort:sort?sort:0});
    }

    static async getById(id){
        return await productsModel.findOne({_id:id});
    }

    static async create(product){
        return await productsModel.create(product);
    }

    static async update(id,fields){
        return await productsModel.updateOne({_id:id},{$set:fields});
    }

    static async delete(id){
        return await productsModel.deleteOne({_id:id});
    }
}