import ProductDTO from '../dto/product.js';

export default class Product{
    constructor(dao){
        this.dao = dao;
    }
    
    create(product){
        const prodDTO = new ProductDTO(product);
        return this.dao.create(prodDTO);
    }

    getAll(limit,page,sort,query){
        return this.dao.getAll(limit,page,sort,query);
    }

    getById(id){
        const product = this.dao.getById(id);
        return product ? product : {};
    }

    update(id,fields){
        return this.dao.update(id,fields);
    }

    delete(id){
        return this.dao.delete(id);
    }
}