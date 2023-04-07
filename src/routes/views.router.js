import { Router } from "express";
import productsModel from "../db/models/products.js";
import cartsModel from "../db/models/carts.js";
import UserModel from '../db/models/users.js';

const viewsRouter = Router();

viewsRouter.get('/',(req,res)=>{
    res.redirect('/login');
});

viewsRouter.get('/register',(req,res)=>{
    res.render('register')
});
viewsRouter.post('/register',async (req,res)=>{
    const {
        body: {
            userEmail,
            userPassword
        }
    } = req;
    console.log(req.body);

    if(!userEmail || !userPassword) res.render('register',{error: "Faltan campos"});
    try{
        const user = await UserModel.create({
            userEmail,
            userPassword
        });
        res.redirect('/login');
    }catch(error){
        res.render('register',{error: error});
    } 
});

viewsRouter.get('/login',(req,res)=>{
    res.render('login');
});

viewsRouter.post('/login',async (req,res)=>{
    const {
        body:{
            userEmail,
            userPassword
        }
    } = req;
    console.log(req.body);
    if(!userEmail || !userPassword) res.render('login',{error: "Faltan campos"});
    let email = userEmail;
    let password = userPassword;
    if(userEmail.includes('admin') && userPassword.includes('admin')){
        email = userEmail.split('admin');
        password = userPassword.split('admin');
        req.session.role = 'admin';
    }else{
        req.session.role='usuario';
    }
    try{
        const usuario = await UserModel.findOne({email});
        if(!usuario) res.render('login',{error:"Credenciales incorrectas"});
        if(usuario.password != password) res.render('login',{error: "Credenciales incorrectas"});
        req.session.user = user;
        res.redirect('/products');
    }catch(error){
        res.render('login',{error: error});
    }
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