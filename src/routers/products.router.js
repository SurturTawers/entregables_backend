import {Router} from 'express';
import ProductsController from '../controllers/products.controller.js';
const productsRouter = Router();

//mostrar productos por query, limit, page, sort
productsRouter.get('/',async (req,res)=>{
    const {query: {limit, page, sort, query}} = req;
    //console.log(limit,page,sort,query);
    //{docs,totalPages,prevPage,nextPage,page, hasPrevPage, hasNextPage}
    const {responseData} = await ProductsController.getProducts(limit,page,sort,query);
    res.status(200).json(responseData);
});

//crear producto
productsRouter.post('/',async (req,res)=>{
    const {body} = req;
    const {result, error} = await ProductsController.createProduct(body);
    error ? (res.status(503).json(error), req.logger.warning(`${req.method} on ${req.url} at ${error.date}-> ${error.code} ${error.name}, ${error.cause}, ${error}`)) : res.status(200).json(result);
    /**/
});

//obtener producto por pid
productsRouter.get('/:pid',async (req,res)=>{
    const {params: {pid}} = req;
    const result = await ProductsController.getProductById(pid);
    result ? res.status(200).json(result): res.status(400).json("No se encontró");
    /**/
});

//actualizar producto por pid
productsRouter.put('/:pid',async (req,res)=>{
    const {params: {pid}, body} = req;
    const result = await ProductsController.updateProductById(pid, body);
    result ? res.status(200).json(result) : res.status(400).json("No se encontró");
});

//borrar productop por pid
productsRouter.delete('/:pid',async (req,res)=>{
    const {params: {pid}} = req;
    const result = await ProductsController.deleteProductById(pid);
    result ? res.status(200).json("Eliminado correctamente") : res.status(400).json("No se encontró");
});

export default productsRouter;