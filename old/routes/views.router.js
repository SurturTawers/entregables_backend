import { Router } from "express";
import __dirname from "../utils.js";
import * as fs from 'fs';
import productsModel from "../dao/models/products.js";
import cartsModel from "../dao/models/carts.js";
const viewsRouter = Router();

const path = __dirname+'/public/storage';
viewsRouter.get('/',(req,res)=>{
    const products = JSON.parse(fs.readFileSync(path+'/productos.json'));
    res.render('home',{products:products});
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
    res.render('products',{pageInfo: responseData, productos:responseData.payload.map(doc => doc.toJSON()),length:pagRes.totalDocs});
});

viewsRouter.get('/products/:pid',async (req,res)=>{
    const {params: {pid}} = req;
    const result = await productsModel.findOne({_id:pid});
    //console.log(result);
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

viewsRouter.get('/realTimeProducts',(req,res)=>{
    res.render('realTimeProducts');
});

export default viewsRouter;