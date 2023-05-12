import cartsModel from '../db/models/carts.js';

class CartsController{
    static async createCart(){
        return await cartsModel.create({products:[]});
    }

    static async showCartById(id){
        return await cartsModel.findOne({_id:id}).populate('products');
    }

    static async cartCheckout(id){
        const result = await cartsModel.findOne({_id:id});
        const count = await cartsModel.aggregate([
            {//desenvuelve el array
                $unwind: "$products"
            },
            {//agrupa por id y los cuenta
                $group: {
                    _id: "$products",
                    count: {
                        $sum: 1
                    }
                }
            },
            {//obtengo el producto por grupo
                $lookup:{
                    from: 'products',
                    localField: "_id",
                    foreignField: "_id",
                    as: "productInfo"
                }
            },
            {//desenvuelvo el array de info 
                $unwind: "$productInfo"
            },
            { //obtengo los campos que necesito
                $project: {
                    "_id": 1,
                    "count": 1,
                    "productInfo.title":1
                }
            }
        ]);
        return {result: result, count:count};
    }

    static async deleteCartById(id){
        return await cartsModel.updateOne({_id:cid},{$set:{products:[]}});
    }

    static async updateCartById(id, products){
        return await cartsModel.updateOne({_id:id},{$push:{products:{$each:products}}});
    }

    static async deleteProductFromCart(cid, pid){
        return await cartsModel.updateOne({_id:cid},{$pullAll:{ products:[{_id:pid}]}});
    }

    static async updateCartProductQty(cid, pid, qty){
        //remove all products with pid
        const resultRemove = await cartsModel.updateOne({_id:cid},{$pullAll:{ products:[{_id:pid}]}});
        if(!resultRemove) return {error: "Error on remove"};
        //set array of pid products by given number
        const productArray = [];
        for(let i = 0 ; i<qty; i++){
            productArray.push({_id:pid});
        }
        //insert each product to products array
        const result = await cartsModel.updateOne({_id:cid},{$push:{products: {$each:productArray}}});
        return {result: result};
    }
}

export default CartsController;