import { Router } from "express";
import productsModel from "../db/models/products.js";
import cartsModel from "../db/models/carts.js";
import UserModel from '../db/models/users.js';
import passport from "passport";

const viewsRouter = Router();

const auth = (req,res,next)=>{
    if(req.session.user){
        return next();
    }
    res.redirect('/login');
}

viewsRouter.get('/',(req,res)=>{
    res.redirect('/login');
});

viewsRouter.get('/home',auth,(req,res)=>{
    res.render('home');
});

viewsRouter.get('/register',(req,res)=>{
    res.render('register')
});

viewsRouter.post('/register', passport.authenticate('register',{failureRedirect:'/register'}),(req,res)=>{
    res.redirect('/login');
});
/*
function(req,res,next){
        passport.authenticate('register',function(error, user, info){
            if(error){
                res.status(401).send('error');
            }else if(!user){
                res.status(401).send(info);
            }else{
                next();
            }
            res.status(401).send(info);
        })(req,res);
    },
    function(req,res){
        res.redirect('/login');
});
/**/

viewsRouter.get('/login',(req,res)=>{
    res.render('login');
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
    req.session.destroy((error) => {
        if (!error) {
          res.redirect('/login');
        } else {
          res.send({status: 'Logout Error', body: error })
        }
    });
});

viewsRouter.get('/products',async (req,res)=>{
    const pagRes = await productsModel.paginate({},{limit:10});
    const responseData = {
        status: "ok",
        payload: pagRes.docs,
        totalPages: pagRes.totalPages,
        prevPage: pagRes.prevPage,
        nextPage: pagRes.nextPage,
        page: pagRes.page,
        hasPrevPage: pagRes.hasPrevPage,
        hasNextPage: pagRes.hasNextPage,
        prevLink: pagRes.hasPrevPage?`http://localhost:${process.env.APP_PORT}+"/api/products?limit=${limit?limit:10}&page=${page?page-1:null}&${sort?`sort=${sort}`:null}&${query?`query=${query}`:null}`:null,
        nextLink: pagRes.hasNextPage?`http://localhost:${process.env.APP_PORT}+"/api/products?limit=${limit?limit:10}&page=${page?page+1:null}&${sort?`sort=${sort}`:null}&${query?`query=${query}`:null}`:null
    }
    res.render('products',{pageInfo: responseData, productos:responseData.payload.map(doc => doc.toJSON()),length:pagRes.totalDocs, usuario: req.session.user, rol: req.session.role});
});

viewsRouter.get('/products/:pid',async (req,res)=>{
    const {params: {pid}} = req;
    const result = await productsModel.findOne({_id:pid});
    res.render('productDetail',{product:result.toJSON()});
});

viewsRouter.get('/carts/:cid',async (req,res)=>{
    const {params: {cid}} = req;
    const result = await cartsModel.findOne({_id:cid});
    const count = await cartsModel.aggregate([
        {//desenvuelve el array
            $unwind: "$products"
        },
        {//agrupa por id y los cuenta
            $group: {
                _id: "$products",
                count: {
                    $sum: 1
                }
            }
        },
        {//obtengo el producto por grupo
            $lookup:{
                from: 'products',
                localField: "_id",
                foreignField: "_id",
                as: "productInfo"
            }
        },
        {//desenvuelvo el array de info 
            $unwind: "$productInfo"
        },
        { //obtengo los campos que necesito
            $project: {
                "_id": 1,
                "count": 1,
                "productInfo.title":1
            }
        }
    ]);
    res.render('cart',{cart:result.toJSON(), products: count});
});

export default viewsRouter;