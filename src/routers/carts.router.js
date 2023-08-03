import { Router } from "express";
import CartsController from "../controllers/carts.controller.js";

const cartsRouter = Router();

//crea un carrito
cartsRouter.post('/',CartsController.createCart);
/*
, (req,res)=>{
    result ? res.status(200).json(result) : res.status(400).json("Error");
});

*/

//mostrar carrito, con populate
cartsRouter.get('/:cid',CartsController.showCartById);
    /*,async (req,res)=>{
    const {params: {cid}} = req;
    const result = await CartsController.showCartById(cid);
    result ? res.status(200).json(result): res.status(400).json("No se encontró");
});
*/

//borrar carrito
cartsRouter.delete('/:cid',CartsController.deleteCartById);
    /*,async (req,res)=>{
    const {params: {cid}} = req;
    const result = await CartsController.deleteCartById(cid);
    result ? res.status(200).json(result): res.status(400).json("Error");
});
*/

//actualizar el carrito con array de productos
cartsRouter.put('/:cid',CartsController.updateCartById);
    /*,async (req,res)=>{
    const {params: {cid}, body} = req;
    //update with products array
    const result = await CartsController.updateCartById(cid, body);
    result ? res.status(200).json(result): res.status(400).json("Error");
});
*/

    /*
//insertar producto o productos en carrito
cartsRouter.post('/:cid/products/:pid',async(req,res)=>{
    const {params: {cid, pid}, body} = req;
    const results = await cartsModel.updateOne({_id:cid}{$set:{products:[{prodId: pid, cantidad: body.cantidad}]}});
    res.status(204).end();
});
/**/
//eliminar producto del carrito
cartsRouter.delete('/:cid/products/:pid', CartsController.deleteProductFromCart);
    /*,async(req,res)=>{
    const {params: {cid, pid}} = req;
    //remove all products with pid
    const result = await CartsController.deleteProductFromCart(cid,pid);
    result ? res.status(200).json(result): res.status(400).json("Error");
});
*/

//actualizar solo la cantidad de ejemplares
cartsRouter.put('/:cid/products/:pid', CartsController.updateCartProductQty);
/*async(req,res)=>{
    const {params: {cid, pid}, body} = req;
    const {result, error} = await CartsController.updateCartProductQty(cid,pid,body.quantity);
    error 
        ? res.status(400).json("Error on update: ", error) 
        : (result ? res.status(200).json(result) : null);
});
*/
cartsRouter.post('/:cid/purchase', CartsController.cartPurchase);
/*async(req,res)=>{
    const {params: {cid}} = req;
    const result = await CartsController.cartPurchase(cid, req.session.user);
    result ? res.status(200).json(result): res.status(400).json("Error");
});
*/

export default cartsRouter;