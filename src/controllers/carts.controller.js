import CartsServices from "../services/carts.services.js";
import ProductsServices from "../services/products.services.js";
import {isValidMongoId} from "../utils.js";

class CartsController{
    static async createCart(req,res){
        try{
            const result = await CartsServices.create();
            result ? res.status(200).json(result) : res.status(400).json("Error");
        } catch (error) {
            //console.log(error.message);
            res.status(400).json({
                error: `DB error: ${error.name} - Code: ${error.code}` ,
                message: error.message
            });
        }
    }

    static async showCartById(req,res){
        const {params: {cid}} = req;
        const {isValid, error, message} = isValidMongoId(cid);
        //logger.info(`${isValid}, ${error}, ${message}`);
        if (error || !isValid) {
            res.status(400).json({
                error: 'Invalid MongoId',
                message: message
            });
        }

        try {
            const cart = await CartsServices.getById(cid, 'products');
            cart ? res.status(200).json(cart) : res.status(400).json("No se encontró");
        } catch (error) {
            //console.log(error.message);
            res.status(400).json({
                error: `DB error: ${error.name} - Code: ${error.code}`,
                message: error.message
            });
        }
    }

    static async deleteCartById(req, res) {
        const {params: {cid}} = req;
        const {isValid, error, message} = isValidMongoId(cid);
        //logger.info(`${isValid}, ${error}, ${message}`);
        if (error || !isValid) {
            res.status(400).json({
                error: 'Invalid MongoId',
                message: message
            });
        }

        try {
            const result = await CartsServices.update({_id: cid}, {$set: {products: []}});
            result ? res.status(200).json(result): res.status(400).json("Error");
        } catch (error) {
            //console.log(error.message);
            res.status(400).json({
                error: `DB error: ${error.name} - Code: ${error.code}`,
                message: error.message
            });
        }
    }

    static async updateCartById(req, res) {
        const {params: {cid}, body} = req;
        const {isValid, error, message} = isValidMongoId(cid);
        //logger.info(`${isValid}, ${error}, ${message}`);
        if (error || !isValid) {
            res.status(400).json({
                error: 'Invalid MongoId',
                message: message
            });
        }

        try {
            const result = await CartsServices.update({_id: cid}, {$push: {products: {$each: body}}});
            result ? res.status(200).json(result) : res.status(400).json("Error");
        } catch (error) {
            //console.log(error.message);
            res.status(400).json({
                error: `DB error: ${error.name} - Code: ${error.code}`,
                message: error.message
            });
        }
    }

    static async deleteProductFromCart(req, res) {
        const {params: {cid, pid}} = req;
        //Falta validar PID
        const {isValid, error, message} = isValidMongoId(cid);
        //logger.info(`${isValid}, ${error}, ${message}`);
        if (error || !isValid) {
            res.status(400).json({
                error: 'Invalid MongoId',
                message: message
            });
        }

        try {
            const result = await CartsServices.update({_id: cid}, {$pullAll: {products: [{_id: pid}]}});
            result ? res.status(200).json(result) : res.status(400).json("Error");
        } catch (error) {
            //console.log(error.message);
            res.status(400).json({
                error: `DB error: ${error.name} - Code: ${error.code}`,
                message: error.message
            });
        }
    }

    static async updateCartProductQty(req, res) {
        const {params: {cid, pid}, body: {quantity}} = req;
        //Falta validar PID
        const {isValid, error, message} = isValidMongoId(cid);
        //logger.info(`${isValid}, ${error}, ${message}`);
        if (error || !isValid) {
            res.status(400).json({
                error: 'Invalid MongoId',
                message: message
            });
        }

        try {
            //remove all products with pid
            const resultRemove = await CartsServices.update({_id: cid}, {$pullAll: {products: [{_id: pid}]}});
        } catch (error) {
            //console.log(error.message);
            res.status(400).json({
                error: `DB error: ${error.name} - Code: ${error.code}`,
                message: error.message
            });
        }

        if (!resultRemove) res.status(400).json("Error on remove");
        //set array of pid products by given number
        const productArray = [];
        for (let i = 0; i < quantity; i++) {
            productArray.push({_id: pid});
        }

        try {
            //insert each product to products array
            const result = await CartsServices.update({_id: cid}, {$push: {products: {$each: productArray}}});
            result ? res.status(200).json(result) : res.status(400).json("Error on update: ", error);
        } catch (error) {
            //console.log(error.message);
            res.status(400).json({
                error: `DB error: ${error.name} - Code: ${error.code}`,
                message: error.message
            });
        }
    }

    static async cartCheckout(req,res,next){
        const {params: {cid}} = req;
        const {isValid, error, message} = isValidMongoId(cid);
        //logger.info(`${isValid}, ${error}, ${message}`);
        if (error || !isValid) {
            res.status(400).json({
                error: 'Invalid MongoId',
                message: message
            });
        }

        try {
            const result = await CartsServices.getById(cid);
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
                    $lookup: {
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
                        "productInfo.title": 1
                    }
                }
            ]);
        } catch (error) {
            //console.log(error.message);
            res.status(400).json({
                error: `DB error: ${error.name} - Code: ${error.code}`,
                message: error.message
            });
        }
        res.locals.data = {result: result, count:count};
        next();
    }

    static async cartPurchase(req, res) {
        const {params: {cid}} = req;
        const {isValid, error, message} = isValidMongoId(cid);
        //logger.info(`${isValid}, ${error}, ${message}`);
        if (error || !isValid) {
            res.status(400).json({
                error: 'Invalid MongoId',
                message: message
            });
        }

        try {
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
                    $lookup: {
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
                        "productInfo.price": 1,
                        "productInfo.stock": 1,
                    }
                }
            ]);
        } catch (error) {
            //console.log(error.message);
            res.status(400).json({
                error: `DB error: ${error.name} - Code: ${error.code}`,
                message: error.message
            });
        }
        //console.log(products);
        let total = 0;
        const finalProducts = [];
        products.forEach(product => {
            console.log(product);
            if (product.count <= product.productInfo.stock) {
                finalProducts.push(product);
                total += product.productInfo.price * product.count;
            }
        });
        //console.log(finalProducts, total, req.session.user);
        try {
            const result = CartsServices.purchase({amount: total, purchaser: req.session.user});
        } catch (error) {
            //console.log(error.message);
            res.status(400).json({
                error: `DB error: ${error.name} - Code: ${error.code}`,
                message: error.message
            });
        }

        //if the ticket has been created, update stock and delete purchased products
        let newStock;
        //TEST THIS
        finalProducts.forEach(product => {
            newStock = product.productInfo.stock - product.count;
            try {
                ProductsServices.update(product._id, newStock);
            } catch (error) {
                //console.log(error.message);
                res.status(400).json({
                    error: `DB error: ${error.name} - Code: ${error.code}`,
                    message: error.message
                });
            }
            //CALL DELETE PRODUCT FROM CAT SERVICE??
            this.deleteProductFromCart(cid, product._id);
        });
    }
}

export default CartsController;