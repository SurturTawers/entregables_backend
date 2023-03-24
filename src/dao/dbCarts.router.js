import { Router } from "express";
import cartsModel from './models/carts.js';
const mongoCartsRouter = Router();

mongoCartsRouter.post('/',async (req,res)=>{
    const {body} = req;
    const result = await cartsModel.create();
    res.status(204).end();
});

mongoCartsRouter.get('/:cid',async (req,res)=>{
    const {params: {cid}} = req;
    const result = await cartsModel.findOne({id:cid});
    res.status(200).json(result);
});

mongoCartsRouter.post('/:cid/product/:pid',async(req,res)=>{
    const {params: {cid, pid}, body} = req;
    const results = await cartsModel.create({body});
    res.status(204).end();
});

export default mongoCartsRouter;