import { Router } from "express";
import __dirname from "../utils.js";
import * as fs from 'fs';
const viewsRouter = Router();

const path = __dirname+'/public/storage';
viewsRouter.get('/',(req,res)=>{
    const products = JSON.parse(fs.readFileSync(path+'/productos.json'));
    res.render('home',{products:products});
});

viewsRouter.get('/realTimeProducts',(req,res)=>{
    res.render('realTimeProducts');
});

export default viewsRouter;