import { Router } from "express";
import passport from "passport";
import ProductsController from "../controllers/products.controller.js";
import CartsController from "../controllers/carts.controller.js";
import auth from '../middlewares/user-auth.middleware.js';
import AuthController from "../controllers/auth.controller.js";
const viewsRouter = Router();

viewsRouter.get('/',(req,res)=>{
    res.redirect('/login');
});

viewsRouter.get('/home',auth,(req,res)=>{
    res.render('home');
});

viewsRouter.get('/login',(req,res)=>{
    res.render('login');
});

viewsRouter.get('/register',(req,res)=>{
    res.render('register')
});

viewsRouter.post('/register', passport.authenticate('register',{failureRedirect:'/register'}),(req,res)=>{
    res.redirect('/login');
});

viewsRouter.post('/login',passport.authenticate('login',{failureRedirect: '/login'}) ,(req,res)=>{
    req.session.user = req.user;
    res.redirect('/home');
});

viewsRouter.get('/github/login', passport.authenticate('github',{failureRedirect: '/login'}), (req,res)=>{
    req.session.user = req.user;
    res.redirect('/home');
});

viewsRouter.post('/logout',(req,res)=>{
    const {error, message} = AuthController.logout(req);
    if(!error){
        res.redirect('/login');
    }else{
        res.send({status: message, body: error});
    }
});

viewsRouter.get('/products',async (req,res)=>{
    const {query: {limit, page, sort, query}} = req;
    const {responseData, pagRes} = ProductsController.getProducts(limit,page,sort,query);
    res.render('products',{pageInfo: responseData, productos:responseData.payload.map(doc => doc.toJSON()),length:pagRes.totalDocs, usuario: req.session.user, rol: req.session.role});
});

viewsRouter.get('/products/:pid',async (req,res)=>{
    const {params: {pid}} = req;
    const result = ProductsController.getProductById(pid);
    res.render('productDetail',{product:result.toJSON()});
});

viewsRouter.get('/carts/:cid',async (req,res)=>{
    const {params: {cid}} = req;
    const {result, count} = CartsController.cartCheckout(cid);
    res.render('cart',{cart:result.toJSON(), products: count});
});

export default viewsRouter;