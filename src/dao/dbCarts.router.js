import { Router } from "express";
import cartsModel from './models/carts.js';
const mongoCartsRouter = Router();

//crea un carrito
mongoCartsRouter.post('/',async (req,res)=>{
    const result = await cartsModel.create({products:[]});
    result ? res.status(200).json(result): res.status(400).json("Error");
});

//mostrar carrito, con populate
mongoCartsRouter.get('/:cid',async (req,res)=>{
    const {params: {cid}} = req;
    const result = await cartsModel.findOne({_id:cid}).populate('products');
    result ? res.status(200).json(result): res.status(400).json("No se encontró");
});

//borrar carrito
mongoCartsRouter.delete('/:cid',async (req,res)=>{
    const {params: {cid}} = req;
    const result = await cartsModel.updateOne({_id:cid},{$set:{products:[]}});
    result ? res.status(200).json(result): res.status(400).json("Error");
});
//actualizar el carrito con array de productos
mongoCartsRouter.put('/:cid',async (req,res)=>{
    const {params: {cid}, body} = req;
    console.log(body);
    //update with products array
    const result = await cartsModel.updateOne({_id:cid},{$push:{products:{$each:body}}});
    result ? res.status(200).json(result): res.status(400).json("Error");
});
/*
//insertar producto o productos en carrito
mongoCartsRouter.post('/:cid/products/:pid',async(req,res)=>{
    const {params: {cid, pid}, body} = req;
    const results = await cartsModel.updateOne({_id:cid}{$set:{products:[{prodId: pid, cantidad: body.cantidad}]}});
    res.status(204).end();
});
/**/
//eliminar producto del carrito
mongoCartsRouter.delete('/:cid/products/:pid',async(req,res)=>{
    const {params: {cid, pid}} = req;
    //remove all products with pid
    const result = await cartsModel.updateOne({_id:cid},{$pullAll:{ products:[{_id:pid}]}});
    result ? res.status(200).json(result): res.status(400).json("Error");
});

//actualizar solo la cantidad de ejemplares
mongoCartsRouter.put('/:cid/products/:pid',async(req,res)=>{
    const {params: {cid, pid}, body} = req;
    const quantity = body.cantidad;
    //remove all products with pid
    const resultRemove = await cartsModel.updateOne({_id:cid},{$pullAll:{ products:[{_id:pid}]}});
    if(!resultRemove) res.status(400).json("Error on remove");
    //set array of pid products by given number
    const productArray = [];
    for(let i = 0 ; i<quantity; i++){
        productArray.push({_id:pid});
    }
    //insert each product to products array
    const result = await cartsModel.updateOne({_id:cid},{$push:{products: {$each:productArray}}});
    result ? res.status(200).json(result): res.status(400).json("Error on update");
});

export default mongoCartsRouter;