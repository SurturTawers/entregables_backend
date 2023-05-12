import ProductsServices from '../services/products.services.js';
class ProductsController{
    static async getProducts(limit, page, sort, query){
        const pagRes = await ProductsServices.getAll(limit,page,sort,query);
        //console.log(pagRes);
        return {
            responseData: {
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
            },
            pagRes:pagRes
        };
    }

    static async createProduct(product){
        try{
            const result = await ProductsServices.create(product);
            return {result: result};
        }catch(error){
            console.log(error);
            return {error: error};
        };
    }

    static async getProductById(id){
        const result = await ProductsServices.getById(id);
        return result;
    }

    static async updateProductById(id, fields){
        const result = await ProductsServices.update(id, fields);
        return result;
    }

    static async deleteProductById(id){
        const result = await ProductsServices.delete(id);
        return result;
    }
}

export default ProductsController;