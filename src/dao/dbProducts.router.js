import {Router} from 'express';
import productsModel from './models/products.js';

const mongoProductsRouter = Router();
mongoProductsRouter.get('/',async (req,res)=>{
    const {query: {limit}} = req;
    const results = await productsModel.find().limit(limit);
    res.status(200).json(results);
});

mongoProductsRouter.post('/',async (req,res)=>{
    const {body} = req;
    try{
        const result = productsModel.create(body);
    }catch(error){
        console.log(error);
        res.status(503).json("Error de query");
    };
    res.status(204).end();
});

mongoProductsRouter.get('/:pid',async (req,res)=>{
    const {paramas: {pid}} = req;
    const result = await productsModel.findOne({id:pid});
    if(!result) res.status(400).json("No se encontró");
    res.status(200).json(result);
});

mongoProductsRouter.put('/:pid',async (req,res)=>{
    const {params: {pid}, body} = req;
    const result = await productsModel.updateOne({id:pid},{$set:body});
});

mongoProductsRouter.delete('/:pid',async (req,res)=>{
    const {params: {pid}} = req;
    const result = await productsModel.deleteOne({id:pid})
    res.status(204).end();
});

export default mongoProductsRouter;