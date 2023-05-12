import CartsServices from "../services/carts.services.js";

class CartsController{
    static async createCart(){
        const result = await CartsServices.create();
        return result;
    }

    static async showCartById(id){
        const cart = await CartsServices.getById(id, 'products');
        return cart;
    }

    static async cartCheckout(id){
        const result = await CartsServices.getById(id);
        const count = await CartsServices.aggregate([
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
        const result = await CartsServices.update({_id:cid},{$set:{products:[]}});
        return result;
    }

    static async updateCartById(id, products){
        const result = await CartsServices.update({_id:id},{$push:{products:{$each:products}}});
        return result;
    }

    static async deleteProductFromCart(cid, pid){
        const result = await CartsServices.update({_id:cid},{$pullAll:{ products:[{_id:pid}]}});
        return result;
    }

    static async updateCartProductQty(cid, pid, qty){
        //remove all products with pid
        const resultRemove = await CartsServices.update({_id:cid},{$pullAll:{ products:[{_id:pid}]}});
        if(!resultRemove) return {error: "Error on remove"};
        //set array of pid products by given number
        const productArray = [];
        for(let i = 0 ; i<qty; i++){
            productArray.push({_id:pid});
        }
        //insert each product to products array
        const result = await CartsServices.update({_id:cid},{$push:{products: {$each:productArray}}});
        return {result: result};
    }
}

export default CartsController;