import ProductsServices from '../services/products.services.js';
import {isValidMongoId} from "../utils.js";
import MailingServices from "../services/mailing.services.js";

class ProductsController {
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
                        prevLink: pagRes.hasPrevPage ? `https://entregablesbackend-production.up.railway.app/api/products?limit=${limit ? limit : 10}&page=${page ? page - 1 : null}&${sort ? `sort=${sort}` : null}&${query ? `query=${query}` : null}` : null,
                        nextLink: pagRes.hasNextPage ? `https://entregablesbackend-production.up.railway.app/api/products?limit=${limit ? limit : 10}&page=${page ? page + 1 : null}&${sort ? `sort=${sort}` : null}&${query ? `query=${query}` : null}` : null
                    },
                    pagRes: pagRes
                }
                : res.locals.data = {message: "Sin resultados"};
            next();
        } catch (error) {
            res.status(400).json({
                error: `DB error: ${error.name} - Code: ${error.code}`,
                message: error.message
            });
        }
    }

    static async createProduct(req, res) {
        const {body} = req;
        try {
            console.log(body);
            const {result, error} = await ProductsServices.create({...body, createdBy: req.user.email, userRole: req.user.role});
            console.log(`Result: ${result}\nError: ${error}`);
            error ? res.status(503).json(error) : res.status(200).json(result);
        } catch (error) {
            console.log(error.code);
            res.status(400).json({
                error: `DB error: ${error.name} - Code: ${error.code}`,
                errorCode: error.code,
                message: error.message
            });
        }
    }

    static async getProductById(req, res, next) {
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
            const result = await ProductsServices.getById(pid);
            result ? res.locals.result = result : res.status(400).json("No se encontró");
            next();
        } catch (error) {
            //console.log(error.message);
            res.status(400).json({
                error: `DB error: ${error.name} - Code: ${error.code}`,
                message: error.message
            });
        }
    }

    static async updateProductById(req, res) {
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
                error: `DB error: ${error.name} - Code: ${error.code}`,
                message: error.message
            });
        }
    }

    static async deleteProductById(req, res) {
        const {params: {pid}} = req;
        const {isValid, error, message} = isValidMongoId(pid);
        if (error || !isValid) {
            res.status(400).json({
                error: 'Invalid MongoId',
                message: message
            });
        }
        try {
            const product = await ProductsServices.getById(pid);
            const result = await ProductsServices.delete(pid);
            if(product.userRole === 'premium'){
                const result = MailingServices.sendEmail(product.createdBy,`Su producto ${product.title} ha sido eliminado`);
            }
            result ? res.status(200).json({message:"Eliminado correctamente"}) : res.status(400).json({message:"No se encontró"});
        } catch (error) {
            //console.log(error.message);
            res.status(400).json({
                error: `DB error: ${error.name} - Code: ${error.code}`,
                message: error.message
            });
        }
    }
}

export default ProductsController;