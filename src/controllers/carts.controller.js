import CartsServices from "../services/carts.services.js";
import ProductsServices from "../services/products.services.js";
import PaymentServices from "../services/payment.services.js";
import {isValidMongoId} from "../utils.js";

import {
    findCartById,
    getProductInfoByGroup,
    groupProductsById,
    obtenerCamposRequeridosCheckout,
    obtenerCamposRequeridosShowCart,
    unwindCartProducts,
    unwindProductInfo
} from "../utils/cart_aggregations.js";

class CartsController {
    static async createCart(req, res) {
        try {
            const result = await CartsServices.create();
            result ? res.status(200).json(result) : res.status(400).json("Error");
        } catch (error) {
            //console.log(error.message);
            res.status(400).json({
                error: `DB error: ${error.name} - Code: ${error.code}`,
                message: error.message
            });
        }
    }

    static async showCartById(req, res, next) {
        const cid = req.user.carrito;
        const {isValid, error, message} = isValidMongoId(cid);
        if (error || !isValid) {
            res.status(400).json({
                error: 'Invalid MongoId',
                message: message
            });
        }

        try {
            const cart = await CartsServices.getById(cid);
            const count = await CartsServices.aggregate([
                findCartById(cid),
                unwindCartProducts,
                groupProductsById,
                getProductInfoByGroup,
                unwindProductInfo,
                obtenerCamposRequeridosShowCart
            ]);
            res.locals.data = {result: cart, count: count};
            next();
        } catch (error) {
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
            result ? res.status(200).json(result) : res.status(400).json("Error");
        } catch (error) {
            //console.log(error.message);
            res.status(400).json({
                error: `DB error: ${error.name} - Code: ${error.code}`,
                message: error.message
            });
        }
    }

    static async updateCartById(req, res) {
        //const {params: {cid}, body} = req;
        console.log(req.user);
        const {body} = req;
        const cid = req.user.carrito;
        const {isValid, error, message} = isValidMongoId(cid);
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
        if (error || !isValid) {
            res.status(400).json({
                error: 'Invalid MongoId',
                message: message
            });
        }

        try {
            const result = await CartsServices.update({_id: cid}, {$pullAll: {products: [{_id: pid}]}});
            result ? res.status(200).json(result) : res.status(400).json({
                message: "Error al actualizar, intentelo nuevamente: ",
                error: error
            });
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
            if (!resultRemove) res.status(400).json({success: false, message: "Error al quitar, intentelo nuevamente"});

            //set array of pid products by given number
            const productArray = [];
            for (let i = 0; i < quantity; i++) {
                productArray.push({_id: pid});
            }

            //insert each product to products array
            const result = await CartsServices.update({_id: cid}, {$push: {products: {$each: productArray}}});
            result ? res.status(200).json(result) : res.status(400).json({
                message: "Error al actualizar, intentelo nuevamente: ",
                error: error
            });
        } catch (error) {
            //console.log(error.message);
            res.status(400).json({
                error: `DB error: ${error.name} - Code: ${error.code}`,
                message: error.message
            });
        }
    }

    static async cartCheckout(req, res, next) {
        //const {params: {cid}} = req;
        const cid = req.user.carrito;
        const {isValid, error, message} = isValidMongoId(cid);
        if (error || !isValid) {
            res.status(400).json({
                error: 'Invalid MongoId',
                message: message
            });
        }

        try {
            const products = await CartsServices.aggregate([
                findCartById(cid),
                unwindCartProducts,
                groupProductsById,
                getProductInfoByGroup,
                unwindProductInfo,
                obtenerCamposRequeridosCheckout
            ]);
            let total = 0;
            const finalProducts = [];
            const leftover = [];
            products.forEach(product => {
                //console.log(product);
                if (product.count <= product.productInfo.stock) {
                    finalProducts.push(product);
                    total += product.productInfo.price * product.count;
                } else {
                    leftover.push(product);
                }
            });
            //console.log(finalProducts, total, req.user);
            if (finalProducts.length === 0) {
                res.locals.data = {success: false, message: "No hay stock para ningún producto en su carrito"};
            } else {
                let data;
                const service = new PaymentServices();
                const stripeCustomer = await service.getCustomer(req.user.email);
                if (stripeCustomer.data.length === 0) {
                    const newCustomer = await service.createCustomer({email: req.user.email});
                    console.log("New customer\n", newCustomer);
                    data = {amount: total, customer: newCustomer.data[0].id, currency: 'clp'};
                } else {
                    data = {amount: total, customer: stripeCustomer.data[0].id, currency: 'clp'};
                }
                const paymentIntent = await service.createPaymentIntent(data);
                res.locals.data = {
                    success: true,
                    cartId: req.user.carrito,
                    products: finalProducts,
                    leftover: leftover,
                    total: total,
                    intent: paymentIntent
                };
            }
            return next();
        } catch (error) {
            //console.log(error.message);
            res.status(400).json({
                error: `DB error: ${error.name} - Code: ${error.code}`,
                message: error.message
            });
        }
    }

    static async cartPurchase(req, res, next) {
        const {params: {cid}} = req;
        const {isValid, error, message} = isValidMongoId(cid);
        if (error || !isValid) {
            res.status(400).json({
                error: 'Invalid MongoId',
                message: message
            });
        }
        try {
            const products = await CartsServices.aggregate([
                findCartById(cid),
                unwindCartProducts,
                groupProductsById,
                getProductInfoByGroup,
                unwindProductInfo,
                obtenerCamposRequeridosCheckout
            ]);
            const sessionProducts = [];
            products.forEach((product) => {
                sessionProducts.push({
                    price_data: {
                        currency: "clp",
                        product_data: {
                            name: `${product._id}`
                        },
                        unit_amount: product.productInfo.price,
                    },
                    quantity: product.count
                });
            });
            const service = new PaymentServices();
            const session = await service.createSession({
                line_items: sessionProducts,
                mode: 'payment',
                success_url: `https://entregablesbackend-production.up.railway.app/api/carts/create-ticket/${cid}`,
                cancel_url: 'https://entregablesbackend-production.up.railway.app/cart/checkout'
            });
            res.locals.sessionurl = session.url;
            next();
            //res.redirect(303,"http://localhost:8080/");
        } catch (error) {
            //console.log(error.message);
            res.status(400).json({
                error: `DB error: ${error.name} - Code: ${error.code}`,
                message: error.message
            });
        }
    }

    static async createTicket(req, res) {
        const {params: {cid}} = req;
        const {isValid, error, message} = isValidMongoId(cid);
        if (error || !isValid) {
            res.status(400).json({
                error: 'Invalid MongoId',
                message: message
            });
        }
        try {
            const products = await CartsServices.aggregate([
                findCartById(cid),
                unwindCartProducts,
                groupProductsById,
                getProductInfoByGroup,
                unwindProductInfo,
                obtenerCamposRequeridosCheckout
            ]);
            const ticketPayload = [];
            let total = 0;
            products.forEach((product) => {
                total += product.count * product.productInfo.price;
                ticketPayload.push({
                    id_producto: product._id,
                    cantidad: product.count,
                    subtotal: product.count * product.productInfo.price
                });
            });
            const result = await CartsServices.purchase({
                total: total,
                purchaser: req.user.email,
                items: ticketPayload
            });
            //if the ticket has been created, update stock and delete purchased products
            let newStock;
            //TEST THIS
            for (let product of products) {
                newStock = product.productInfo.stock - product.count;
                //console.log(newStock);
                try {
                    await ProductsServices.update(product._id, {
                        stock: newStock,
                        status: newStock === 0 ? false : true
                    });
                } catch (error) {
                    //console.log(error.message);
                    res.status(400).json({
                        error: `DB error: ${error.name} - Code: ${error.code}`,
                        message: error.message
                    });
                }
                const result = await CartsServices.update({_id: cid}, {$pullAll: {products: [{_id: product._id}]}});
            }
            res.redirect(303, `https://entregablesbackend-production.up.railway.app/ticket/${result._id}`);
        } catch (error) {
            res.status(400).json({
                error: `DB error: ${error.name} - Code: ${error.code}`,
                message: error.message
            });
        }
        /**/
    }
}

export default CartsController;