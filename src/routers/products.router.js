import {Router} from 'express';
import ProductsController from '../controllers/products.controller.js';
import authRoleMiddleware from '../middlewares/user-auth.middleware.js';
import JwtAuthMiddleware from "../middlewares/jwt-auth.middleware.js";

const productsRouter = Router();

//mostrar productos por query, limit, page, sort
productsRouter.get('/', JwtAuthMiddleware('jwt'), authRoleMiddleware('admin'), ProductsController.getProducts, (req, res, mensaji) => {
    res.status(200).json(res.locals.data);
});

//crear producto
productsRouter.post('/', JwtAuthMiddleware('jwt'), authRoleMiddleware('premium'), ProductsController.createProduct);

//obtener producto por pid
productsRouter.get('/:pid', ProductsController.getProductById, (req, res) => {
    res.status(200).json(res.locals.result);
});

//actualizar producto por pid
productsRouter.put('/:pid', ProductsController.updateProductById);

//borrar producto por pid
productsRouter.delete('/:pid', JwtAuthMiddleware('jwt'), authRoleMiddleware('premium'), ProductsController.deleteProductById);

export default productsRouter;