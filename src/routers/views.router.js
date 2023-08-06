import {Router} from "express";
import ProductsController from "../controllers/products.controller.js";
import CartsController from "../controllers/carts.controller.js";
//import authRoleMiddleware from '../middlewares/user-auth.middleware.js';
import {generateProduct} from '../utils/mocks/product.js';
import JWTAuthMiddleware from "../middlewares/jwt-auth.middleware.js";

const viewsRouter = Router();

viewsRouter.get('/', (req, res) => {
    res.redirect('/login');
});

viewsRouter.get('/login', (req, res) => {
    res.render('login', {layout: 'auth'});
});

viewsRouter.get('/register', (req, res) => {
    res.render('register', {layout: 'auth'})
});

viewsRouter.get('/home', JWTAuthMiddleware, (req, res) => {
    res.render('home');
});

viewsRouter.get('/products', JWTAuthMiddleware, ProductsController.getProducts, (req, res) => {
    const {responseData, pagRes} = res.locals.data;
    res.render('products', {
        pageInfo: responseData,
        productos: responseData.payload.map(doc => doc.toJSON()),
        length: pagRes.totalDocs,
        usuario: req.session.user,
        rol: req.session.role
    });
});

viewsRouter.get('/products/:pid', JWTAuthMiddleware, ProductsController.getProductById, (req, res) => {
    const result = res.locals.result;
    res.render('productDetail', {product: result ? result.toJSON() : null});
});

viewsRouter.get('/carts/:cid', JWTAuthMiddleware, CartsController.cartCheckout, (req, res) => {
    const {result, count} = res.locals.data;
    res.render('cart', {cart: result.toJSON(), products: count});
});

viewsRouter.get('/mockingproducts', (req, res) => {
    const mockedProducts = []
    for (let i = 0; i < 100; i++) {
        mockedProducts.push(generateProduct());
    }
    //res.status(200).json({productos:mockedProducts});
    res.render('productsmock', {productos: mockedProducts, length: 1})
});

export default viewsRouter;