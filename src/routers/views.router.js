import {Router} from "express";
import JWTAuthMiddleware from "../middlewares/jwt-auth.middleware.js";
import authRoleMiddleware from "../middlewares/user-auth.middleware.js";
import ProductsController from "../controllers/products.controller.js";
import CartsController from "../controllers/carts.controller.js";
import TicketsController from "../controllers/tickets.controller.js";
import {generateProduct} from '../utils/mocks/product.js';

const viewsRouter = Router();

viewsRouter.get('/', (req, res) => {
    res.redirect('/login');
});

viewsRouter.get('/unauthorized', (req, res) => {
    res.render('unauthorized', {layout: 'auth'});
});

viewsRouter.get('/login', (req, res) => {
    res.render('login', {layout: 'auth'});
});

viewsRouter.get('/register', (req, res) => {
    res.render('register', {layout: 'auth'})
});

viewsRouter.get('/admin/register', (req, res) => {
    res.render('admin-register', {layout: 'auth'})
})

viewsRouter.get('/home', JWTAuthMiddleware('jwt'), (req, res) => {
    res.render('home', {layout: req.user.role === 'admin' ? 'admin-main' : 'main'});
});

viewsRouter.get('/products', JWTAuthMiddleware('jwt'), ProductsController.getProducts, (req, res) => {
    const {responseData, pagRes} = res.locals.data;
    res.render('products', {
        pageInfo: responseData,
        productos: responseData.payload.map(doc => doc.toJSON()),
        length: pagRes.totalDocs,
        usuario: req.session.user,
        rol: req.session.role,
        layout: req.user.role === 'admin' ? 'admin-main' : 'main'
    });
});

viewsRouter.get('/new-product', JWTAuthMiddleware('jwt'), authRoleMiddleware('admin'), ProductsController.getProducts, (req, res) => {
    res.render('createProduct', {layout: 'admin-main'});
});

viewsRouter.get('/products/:pid', JWTAuthMiddleware('jwt'), ProductsController.getProductById, (req, res) => {
    const result = res.locals.result;
    res.render('productDetail', {
        product: result ? result.toJSON() : null,
        layout: req.user.role === 'admin' ? 'admin-main' : 'main'
    });
});

viewsRouter.get('/cart', JWTAuthMiddleware('jwt'), CartsController.showCartById, (req, res) => {
    const {result, count} = res.locals.data;
    res.render('cart', {
        cart: result.toJSON(),
        products: count,
        layout: req.user.role === 'admin' ? 'admin-main' : 'main'
    });
});

viewsRouter.get('/cart/checkout', JWTAuthMiddleware('jwt'), CartsController.cartCheckout, (req, res) => {
    const {success, message, cartId, products, leftover, total, intent} = res.locals.data;
    if(!success){
        res.render('cart-summary',{
            success: success,
            message: message,
            layout: req.user.role === 'admin' ? 'admin-main' : 'main'
        })
    }else{
        res.render('cart-summary', {
            success: success,
            cart_id: cartId,
            products: products,
            leftover: leftover,
            total: total,
            client_secret: intent.client_secret,
            layout: req.user.role === 'admin' ? 'admin-main' : 'main'
        });
    }
});

viewsRouter.get('/purchases', JWTAuthMiddleware('jwt'), TicketsController.getTickets, (req, res) => {
    const {tickets, message} = res.locals.data;
    if(tickets){
        res.render('purchases', {
            tickets: tickets,
            layout: req.user.role === 'admin' ? 'admin-main' : 'main'
        });
    }else{
        res.render('purchases', {
            message: message,
            layout: req.user.role === 'admin' ? 'admin-main' : 'main'
        });
    }
});

viewsRouter.get('/ticket/:tid', JWTAuthMiddleware('jwt'), TicketsController.getTicketById, (req, res) => {
    const {ticket, message} = res.locals.data
    if(ticket){
        res.render('purchase-ticket', {
            ticket: ticket.toJSON(),
            layout: req.user.role === 'admin' ? 'admin-main' : 'main'
        });
    }else{
        res.render('purchase-ticket', {
            message: message,
            layout: req.user.role === 'admin' ? 'admin-main' : 'main'
        });
    }
});

viewsRouter.get('/mockingproducts', JWTAuthMiddleware('jwt'), authRoleMiddleware('admin'), (req, res) => {
    const mockedProducts = []
    for (let i = 0; i < 100; i++) {
        mockedProducts.push(generateProduct());
    }
    res.render('productsmock', {
        productos: mockedProducts,
        length: 1,
        layout: req.user.role === 'admin' ? 'admin-main' : 'main'
    })
});

export default viewsRouter;