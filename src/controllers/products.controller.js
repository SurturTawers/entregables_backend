import ProductsServices from '../services/products.services.js';
import CustomError from '../utils/errors/CustomError.js';
import CustomErrorTypes from '../utils/errors/CustomErrorTypes.js';
import {isValidMongoId} from "../utils.js";
import {logger} from "../utils/logger.js";
class ProductsController{
    static async getProducts(req, res, next) {
        const {query: {limit, page, sort, query}} = req;
        try {
            const pagRes = await ProductsServices.getAll(limit, page, sort, query);
            pagRes
                ? res.locals.data = {
                    responseData: {
                        status: "ok",
                        payload: pagRes.docs,
                        totalPages: pagRes.totalPages,
                        prevPage: pagRes.prevPage,
                        nextPage: pagRes.nextPage,
                        page: pagRes.page,
                        hasPrevPage: pagRes.hasPrevPage,
                        hasNextPage: pagRes.hasNextPage,
                        prevLink: pagRes.hasPrevPage ? `http://localhost:${process.env.APP_PORT}/api/products?limit=${limit ? limit : 10}&page=${page ? page - 1 : null}&${sort ? `sort=${sort}` : null}&${query ? `query=${query}` : null}` : null,
                        nextLink: pagRes.hasNextPage ? `http://localhost:${process.env.APP_PORT}/api/products?limit=${limit ? limit : 10}&page=${page ? page + 1 : null}&${sort ? `sort=${sort}` : null}&${query ? `query=${query}` : null}` : null
                    },
                    pagRes: pagRes
                }
                : res.locals.data = {message:"Sin resultados"};
            next();
        } catch (error) {
            res.status(400).json({
                error: `DB error: ${error.name} - Code: ${error.code}`,
                message: error.message
            });
        }
    }

    static async getProductById(req, res, next){
        const {params: {pid}} = req;
        const {isValid, error, message} = isValidMongoId(pid);
        //logger.info(`${isValid}, ${error}, ${message}`);
        if (error || !isValid) {
            res.status(400).json({
                error: 'Invalid MongoId',
                message: message
            });
        }

        try{
            const result = await ProductsServices.getById(pid);
            result ? res.locals.result = result : res.status(400).json("No se encontró");
            next();
        } catch (error) {
            //console.log(error.message);
            res.status(400).json({
                error: `DB error: ${error.name} - Code: ${error.code}` ,
                message: error.message
            });
        }
    }

    static async createProduct(req,res){
        const {body} = req;
        try{
            const {result, error }= await ProductsServices.create(body);
            req.logger.warning(`${req.method} on ${req.url} at ${error.date}-> ${error.code} ${error.name}, ${error.cause}, ${error}`);
            error ? res.status(503).json(error) : res.status(200).json(result);
        }catch(error){
            res.status(400).json({
                error: `DB error: ${error.name} - Code: ${error.code}` ,
                message: error.message
            });
        };
    }

    static async updateProductById(req, res){
        const {params: {pid}, body} = req;
        const {isValid, error, message} = isValidMongoId(pid);
        //logger.info(`${isValid}, ${error}, ${message}`);
        if (error || !isValid) {
            res.status(400).json({
                error: 'Invalid MongoId',
                message: message
            });
        }
        try {
            const result = await ProductsServices.update(pid, body);
            result ? res.status(200).json(result) : res.status(400).json("No se encontró");
        } catch (error) {
            //console.log(error.message);
            res.status(400).json({
                error: `DB error: ${error.name} - Code: ${error.code}` ,
                message: error.message
            });
        }
    }

    static async deleteProductById(req,res){
        const {params: {pid}} = req;
        const {isValid, error, message} = isValidMongoId(pid);
        //logger.info(`${isValid}, ${error}, ${message}`);
        if (error || !isValid) {
            res.status(400).json({
                error: 'Invalid MongoId',
                message: message
            });
        }
        try {
            const result = await ProductsServices.delete(id);
            result ? res.status(200).json("Eliminado correctamente") : res.status(400).json("No se encontró");
        } catch (error) {
            //console.log(error.message);
            res.status(400).json({
                error: `DB error: ${error.name} - Code: ${error.code}` ,
                message: error.message
            });
        }
    }
}

export default ProductsController;