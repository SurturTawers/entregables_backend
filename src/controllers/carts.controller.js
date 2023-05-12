import CartsServices from "../services/carts.services";

class CartsController{
    static createCart(){
        return CartsServices.create();
    }

    static showCartById(id){
        return CartsServices.getById(id, 'products');
    }

    static cartCheckout(id){
        const result = CartsServices.getById(id);
        const count = CartsServices.aggregate([
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

    static deleteCartById(id){
        return CartsServices.update({_id:cid},{$set:{products:[]}});
    }

    static updateCartById(id, products){
        return CartsServices.update({_id:id},{$push:{products:{$each:products}}});
    }

    static deleteProductFromCart(cid, pid){
        return CartsServices.update({_id:cid},{$pullAll:{ products:[{_id:pid}]}});
    }

    static updateCartProductQty(cid, pid, qty){
        //remove all products with pid
        const resultRemove = CartsServices.update({_id:cid},{$pullAll:{ products:[{_id:pid}]}});
        if(!resultRemove) return {error: "Error on remove"};
        //set array of pid products by given number
        const productArray = [];
        for(let i = 0 ; i<qty; i++){
            productArray.push({_id:pid});
        }
        //insert each product to products array
        const result = CartsServices.update({_id:cid},{$push:{products: {$each:productArray}}});
        return {result: result};
    }
}

export default CartsController;