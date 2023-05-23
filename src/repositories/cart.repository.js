import CartDTO from '../dto/cart.js'

export default class Cart{
    constructor(dao){
        this.dao = dao;
    }

    create(products){
        const cartDTO = new CartDTO(products);
        return this.dao.create(cartDTO);
    }

    getById(id,populate){
        return this.dao.getById(id,populate);
    }

    aggregate(aggregation){
        return this.dao.aggregate(aggregation);
    }

    update(filter,query){
        return this.dao.update(filter,query);
    }
}