import {Router} from 'express';
import ProductsController from '../controllers/products.controller.js';

const productsRouter = Router();

//mostrar productos por query, limit, page, sort
productsRouter.get('/',ProductsController.getProducts, (req,res, mensaji)=>{
    res.status(200).json(res.locals.data);
});

//obtener producto por pid
productsRouter.get('/:pid',ProductsController.getProductById, (req,res)=>{
    res.status(200).json(res.locals.result);
});

//crear producto
productsRouter.post('/',ProductsController.createProduct);

//actualizar producto por pid
productsRouter.put('/:pid',ProductsController.updateProductById);

//borrar producto por pid
productsRouter.delete('/:pid',ProductsController.deleteProductById);

export default productsRouter;