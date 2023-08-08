import { productRepository } from "../repositories/index.js";

export default class ProductsServices{
    static create(product){
        return productRepository.create(product);
    }

    static getAll(limit,page,sort,query){
        return productRepository.getAll(limit,page,sort,query);
    }

    static getById(id){
        return productRepository.getById(id);
    }

    static update(id,fields){
        return productRepository.update(id,fields);
    }

    static delete(id){
        return productRepository.delete(id);
    }
}