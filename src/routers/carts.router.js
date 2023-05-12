import { Router } from "express";
import CartsController from "../controllers/carts.controller.js";

const cartsRouter = Router();

//crea un carrito
cartsRouter.post('/',async (req,res)=>{
    const result = CartsController.createCart();
    result ? res.status(200).json(result) : res.status(400).json("Error");
});

//mostrar carrito, con populate
cartsRouter.get('/:cid',async (req,res)=>{
    const {params: {cid}} = req;
    const result = CartsController.showCartById(cid);
    result ? res.status(200).json(result): res.status(400).json("No se encontró");
});

//borrar carrito
cartsRouter.delete('/:cid',async (req,res)=>{
    const {params: {cid}} = req;
    const result = CartsController.deleteCartById(cid);
    result ? res.status(200).json(result): res.status(400).json("Error");
});
//actualizar el carrito con array de productos
cartsRouter.put('/:cid',async (req,res)=>{
    const {params: {cid}, body} = req;
    //update with products array
    const result = CartsController.updateCartById(cid, body);
    result ? res.status(200).json(result): res.status(400).json("Error");
});
/*
//insertar producto o productos en carrito
cartsRouter.post('/:cid/products/:pid',async(req,res)=>{
    const {params: {cid, pid}, body} = req;
    const results = await cartsModel.updateOne({_id:cid}{$set:{products:[{prodId: pid, cantidad: body.cantidad}]}});
    res.status(204).end();
});
/**/
//eliminar producto del carrito
cartsRouter.delete('/:cid/products/:pid',async(req,res)=>{
    const {params: {cid, pid}} = req;
    //remove all products with pid
    const result = CartsController.deleteProductFromCart(cid,pid);
    result ? res.status(200).json(result): res.status(400).json("Error");
});

//actualizar solo la cantidad de ejemplares
cartsRouter.put('/:cid/products/:pid',async(req,res)=>{
    const {params: {cid, pid}, body} = req;
    const {result, error} = CartsController.updateCartProductQty(cid,pid,body.quantity);
    error 
        ? res.status(400).json("Error on update: ", error) 
        : (result ? res.status(200).json(result) : null);
});

export default cartsRouter;