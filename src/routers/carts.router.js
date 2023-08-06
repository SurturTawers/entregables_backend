import {Router} from "express";
import CartsController from "../controllers/carts.controller.js";

const cartsRouter = Router();

//crea un carrito
cartsRouter.post('/', CartsController.createCart);

//mostrar carrito, con populate
cartsRouter.get('/:cid', CartsController.showCartById);

//borrar carrito
cartsRouter.delete('/:cid', CartsController.deleteCartById);

//actualizar el carrito con array de productos
cartsRouter.put('/:cid', CartsController.updateCartById);

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

//actualizar solo la cantidad de ejemplares
cartsRouter.put('/:cid/products/:pid', CartsController.updateCartProductQty);

cartsRouter.post('/:cid/purchase', CartsController.cartPurchase);

export default cartsRouter;