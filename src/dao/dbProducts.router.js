import {Router} from 'express';
import productsModel from './models/products.js';
const mongoProductsRouter = Router();

//mostrar productos por query, limit, page, sort
mongoProductsRouter.get('/',async (req,res)=>{
    const {query: {limit, page, sort, query}} = req;
    console.log(limit,page,sort,query);
    //{docs,totalPages,prevPage,nextPage,page, hasPrevPage, hasNextPage}
    const pagRes = await productsModel.paginate(query?{query}:{},{limit:limit?limit:10,page:page?page:1,sort:sort?sort:0});
    console.log(pagRes);
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
    res.status(200).json(responseData);
});

//crear producto
mongoProductsRouter.post('/',async (req,res)=>{
    const {body} = req;
    try{
        const result =  await productsModel.create(body);
        res.status(200).json(result);
    }catch(error){
        console.log(error);
        res.status(503).json("Error de query");
    };
    /**/
});

//obtener producto por pid
mongoProductsRouter.get('/:pid',async (req,res)=>{
    const {params: {pid}} = req;
    const result = await productsModel.findOne({_id:pid});
    result ? res.status(200).json(result): res.status(400).json("No se encontró");
    /**/
});

//actualizar producto por pid
mongoProductsRouter.put('/:pid',async (req,res)=>{
    const {params: {pid}, body} = req;
    const result = await productsModel.updateOne({_id:pid},{$set:body});
    result ? res.status(200).json(result): res.status(400).json("No se encontró");
});

//borrar productop por pid
mongoProductsRouter.delete('/:pid',async (req,res)=>{
    const {params: {pid}} = req;
    const result = await productsModel.deleteOne({_id:pid})
    result ? res.status(200).json("Eliminado correctamente"): res.status(400).json("No se encontró");
});

export default mongoProductsRouter;