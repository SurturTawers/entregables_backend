import productsModel from '../models/products.js';

export default class Product{
    create(product){
        return productsModel.create(product);
    }

    getAll(limit,page,sort,query){
        return productsModel.paginate(query?{query}:{},{limit:limit?limit:10,page:page?page:1,sort:sort?sort:0});
    }

    getById(id){
        return productsModel.findOne({_id:id});
    }

    update(id,fields){
        return productsModel.updateOne({_id:id},{$set:fields});
    }

    delete(id){
        return productsModel.findByIdAndDelete(id);
    }
}