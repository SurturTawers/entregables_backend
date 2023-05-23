import CartsServices from "../services/carts.services.js";
import ProductsServices from "../services/products.services.js";

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

    static async cartPurchase(cid, user){
        const products = await CartsServices.aggregate([
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
                    "productInfo.price":1,
                    "productInfo.stock":1,
                }
            }
        ]);
        //console.log(products);
        let total = 0;
        const finalProducts = [];
        products.forEach(product => {
            console.log(product);
            if(product.count <= product.productInfo.stock){
                finalProducts.push(product);
                total += product.productInfo.price * product.count;
            }
        });
        console.log(finalProducts, total, user);
        const result = CartsServices.purchase({amount:total, purchaser: user});
        //if the ticket has been created, update stock and delete purchased products
        let newStock;
        finalProducts.forEach(product => {
            newStock = product.productInfo.stock - product.count;
            ProductsServices.update(product._id, newStock);
            this.deleteProductFromCart(cid,product._id);
        });
    }
}

export default CartsController;